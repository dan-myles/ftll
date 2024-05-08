// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![allow(non_snake_case)]
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    app_lib::run();
}
