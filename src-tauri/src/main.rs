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

#[cfg(test)]
mod tests {
    use super::health_check;

    #[test]
    fn health_check_confirma_core_ativo() {
        assert_eq!(health_check(), "Core OPIE ativo e pronto.");
    }
}
