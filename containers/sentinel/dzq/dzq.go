package dzq

import (
	"encoding/binary"
	"fmt"
	"sort"

	"ftl-api/a2s"
	"ftl-api/log"
)

// What we expect to return
type Mod struct {
	WorkshopId int    `json:"workshopId"`
	Name       string `json:"name"`
}

// Private types for DayZ mods
type dzMod struct {
	hash          uint32
	workshopIdLen uint8
	workshopId    uint32
	modNameLen    uint8
	modName       string
}

type dzRules struct {
	uk1      uint8
	uk2      uint8
	dlcCount uint8
	uk3      uint8
	dlcs     []uint32
	modCount uint8
	mods     []dzMod
	// can't be bothered to parse the rest of the data
}

// ------------------------------
// Function: GrabRules
// Parameters: addr string
// Returns: []Mod, error
// Package: dzq (dayz query)
// ------------------------------
// This may not make sense to me in the future so lots of comments lol
// We are letting the library instantiate the UDP connection and solve the
// Challenge number for us, then we parse rule and go from CHUNK format
// to Arma3 specific server message format... I know that's a lot of words
// so heres a diagram
// Send UDP Request For Challenge -> To Dayz Server -> Receive UDP Response With Challenge
// Send UDP Request For Rules + Challenge -> To Dayz Server -> Receive UDP Response With Rules
// Parse Multipacket Response to KV Pairs -> Order Packets -> Chop Keys
// Join Values -> Replace Escape Sequences -> Parse Byte Slices by Arma3 Format
// -> Return Mods
// that format can be found at https://community.bistudio.com/wiki/Arma_3:_ServerBrowserProtocol3
func GetMods(addr string) ([]Mod, error) {
	log.Logger.Info("Grabbing mods for ", addr)
	// This is necessary to query the server
	// Tried doing hand UDP and handling multiple packet responses was annoying
	// so this library makes it a tad easier
	rules, err := query(addr)
	if err != nil {
		return nil, err
	}

	// Now we can grab the rules of format map[string]string
	// however for Arma3 we do uint16 -> string (key -> value)
	// 2 bytes at the start of the string is the key, the rest is the value
	pre_bin := make(map[uint16]string)
	for k := range rules.Rules {
		if len(k) == 2 {
			key_bytes := []byte(k)
			key_int := binary.LittleEndian.Uint16(key_bytes)

			log.Logger.Debug("key_int: ", key_int)

			pre_bin[key_int] = rules.Rules[k]
		}
	}

	// sort the map by key
	// this is because the rules are not in order (maps lol :P)
	// then we use this sorted order
	var keys []int
	for k := range pre_bin {
		keys = append(keys, int(k))
	}
	sort.Ints(keys)

	// join all the values together by sorted order
	var byte_slice []byte
	for _, k := range keys {
		value := pre_bin[uint16(k)]
		byte_slice = append(byte_slice, []byte(value)...)
	}

	// replace escape sequences
	// for some reason valve developers were just like fuck it
	// lets not use 0x1 0x00 0xFF, obviously these are important bytes
	// but why not just standardize a protocol, these "Rules" sections
	// are different for every game, sadge
	type escape struct {
		sequence    []byte
		replacement []byte
	}

	// Put these here to remember
	// escapes := []escape{
	// 	{[]byte{0x01, 0x01}, []byte{0x01}},
	// 	{[]byte{0x01, 0x02}, []byte{0x00}},
	// 	{[]byte{0x01, 0x03}, []byte{0xFF}},
	// }

	// pretty print byte slice by chunks of 2 bytes
	hex := fmt.Sprintf("Full byte slice: %X ", byte_slice)
	log.Logger.Debug(hex)
	log.Logger.Debug("byte_slice length: ", len(byte_slice))

	// remove escapes
	for index := 0; index < len(byte_slice); index++ {
		if byte_slice[index] == 0x01 && byte_slice[index+1] == 0x01 {
			log.Logger.Debug("Found a sequence: 0101 -> i:", index)
			hex = fmt.Sprintf("Pre-escaped bytes: %X ", byte_slice[:index+4])
			log.Logger.Debug(hex)

			byte_slice[index+1] = 0x01
			byte_slice = append(byte_slice[:index], byte_slice[index+1:]...)

			hex = fmt.Sprintf("Altered bytes: %X ", byte_slice[:index+4])
			log.Logger.Debug(hex)

			continue
		}

		if byte_slice[index] == 0x01 && byte_slice[index+1] == 0x02 {
			log.Logger.Debug("Found a sequence: 0102 -> i:", index)
			hex = fmt.Sprintf("Pre-escaped bytes: %X ", byte_slice[:index+4])
			log.Logger.Debug(hex)

			byte_slice[index+1] = 0x00
			byte_slice = append(byte_slice[:index], byte_slice[index+1:]...)

			hex = fmt.Sprintf("Altered bytes: %X ", byte_slice[:index+4])
			log.Logger.Debug(hex)

			continue
		}

		if byte_slice[index] == 0x01 && byte_slice[index+1] == 0x03 {
			log.Logger.Debug("Found a sequence: 0103 -> i:", index)
			hex = fmt.Sprintf("Pre-escaped bytes: %X ", byte_slice[:index+4])
			log.Logger.Debug(hex)

			byte_slice[index+1] = 0xFF
			byte_slice = append(byte_slice[:index], byte_slice[index+1:]...)

			hex = fmt.Sprintf("Altered bytes: %X ", byte_slice[:index+4])
			log.Logger.Debug(hex)

			continue
		}
	}

	// parse the byte slice
	// for some reason binary doesnt have uint8????????
	// I know its just one byte but cmmonnn
	// we just parse and slice and do that a lot
	// for anything larger than 1 byte we use binary.littlendian to make sure
	// that it comes out right :)
	var result dzRules

	if len(byte_slice) < 127 {
		return nil, fmt.Errorf("workshopIdBytes length is less than 4, or the byte_slice is null")
	}

	result.uk1 = uint8(byte_slice[0:1][0])
	byte_slice = byte_slice[1:]

	result.uk2 = uint8(byte_slice[0:1][0])
	byte_slice = byte_slice[1:]

	result.dlcCount = uint8(byte_slice[0:1][0])
	byte_slice = byte_slice[1:]

	result.uk3 = uint8(byte_slice[0:1][0])
	byte_slice = byte_slice[1:]

	// here we can use the dlcCount to determine how many dlcs there are
	// also we can use binary to convert the byte slice to uint32
	// also we can't just skip to modcount since DLC count is variable
	// so we have to parse dlcCount and DLCS before we can check mods
	for i := 0; i < int(result.dlcCount); i++ {
		dlc := binary.LittleEndian.Uint32(byte_slice[0:4])

		if len(byte_slice) < 4 {
			return nil, fmt.Errorf("byte_slice length is less than 4 at a dlcCount of: %d", result.dlcCount)
		}

		byte_slice = byte_slice[4:]

		result.dlcs = append(result.dlcs, dlc)
	}

	result.modCount = uint8(byte_slice[0:1][0])
	byte_slice = byte_slice[1:]

	// finally parsing mods
	for i := 0; i < int(result.modCount); i++ {
		var mod dzMod

		mod.hash = binary.LittleEndian.Uint32(byte_slice[0:4])
		byte_slice = byte_slice[4:]

		mod.workshopIdLen = uint8(byte_slice[0:1][0])
		byte_slice = byte_slice[1:]
		log.Logger.Debug("mod.workshopIdLen: ", mod.workshopIdLen&0x0F)
		log.Logger.Debug("(MOD) byte_slice length: ", len(byte_slice))

		// this is a bit weird but...
		// we should use the workshopIdLen to determine how many bytes to read
		// & with 0x0F in little endian
		// forgot why is Anded with 0x0F honestly
		workshopIdBytes := byte_slice[0 : mod.workshopIdLen&0x0F]
		log.Logger.Debug("workshopIdBytes: ", workshopIdBytes)

		if mod.workshopIdLen <= 1 {
			log.Logger.Warn(
				`There was a serious error parsing workshopIdLen from server,
        the workshopId of one of the mods may be corrupt.
        The modlist for this server will be incomplete: `, addr)
			break
		}

		if len(workshopIdBytes) < 4 {
			log.Logger.Warn(
				`The length of workshopIdBytes is less than 4
        this may mean a corrupt modlist, or a corrupt workshopId for: `, addr)
			break
		}

		if len(byte_slice) < int(mod.workshopIdLen&0x0F) {
			log.Logger.Warn(
				`The length of byte_slice is less than workshopIdLen
        this may mean a corrupt modlist, or a corrupt workshopId for: `, addr)
			break
		}

		mod.workshopId = local_uint32(workshopIdBytes, addr)
		byte_slice = byte_slice[mod.workshopIdLen&0x0F:]

		if len(byte_slice) < 1 {
			log.Logger.Warn(
				`The length of byte_slice is less than 1
        this may mean a corrupt modlist, or a corrupt modName for: `, addr)
			break
		}

		mod.modNameLen = uint8(byte_slice[0:1][0])
		byte_slice = byte_slice[1:]

		if len(byte_slice) < int(mod.modNameLen) {
			log.Logger.Warn(
				`The length of byte_slice is less than modNameLen
        this may mean a corrupt modlist, or a corrupt modName for: `, addr)
			break
		}

		mod.modName = string(byte_slice[0:mod.modNameLen])
		byte_slice = byte_slice[mod.modNameLen:]

		result.mods = append(result.mods, mod)
	}

	// now we have all the mods, there is more data down there
	// but we don't need it, we can just return the mods
	// most of the data there is acquired through steam API anyway
	// fetching it again would be redundant
	var mods []Mod
	for _, mod := range result.mods {
		mods = append(mods, Mod{
			WorkshopId: int(mod.workshopId),
			Name:       mod.modName,
		})
	}

	log.Logger.Debug("Found Mods: ", mods)
	return mods, nil
}

func query(addr string) (*a2s.RulesInfo, error) {
	client, err := a2s.NewClient(addr)
	if err != nil {
		return nil, err
	}

	rules, err := client.QueryRules()
	if err != nil {
		return nil, err
	}

	return rules, nil
}

func local_uint32(b []byte, addr string) uint32 {
	_ = b[3] // bounds check hint to compiler; see golang.org/issue/14808
	return uint32(b[0]) | uint32(b[1])<<8 | uint32(b[2])<<16 | uint32(b[3])<<24
}
