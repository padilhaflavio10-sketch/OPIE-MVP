#[tauri::command]
fn health_check() -> &'static str {
    "Core OPIE ativo e pronto."
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![health_check])
        .run(tauri::generate_context!())
        .expect("falha ao executar o OPIE MVP");
}
