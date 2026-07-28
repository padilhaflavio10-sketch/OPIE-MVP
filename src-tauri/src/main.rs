use serde::Serialize;
use std::{env, fs};
use tauri::AppHandle;

const HEALTH_MESSAGE: &str = "Core OPIE ativo e pronto.";
const HEALTH_E2E_ENV: &str = "OPIE_E2E_HEALTH_MARKER";

#[derive(Serialize)]
struct HealthCheckResponse {
    message: &'static str,
    e2e: bool,
}

#[tauri::command]
fn health_check() -> HealthCheckResponse {
    HealthCheckResponse {
        message: HEALTH_MESSAGE,
        e2e: env::var_os(HEALTH_E2E_ENV).is_some(),
    }
}

#[tauri::command]
fn confirm_health_check_e2e(app: AppHandle, response: String) -> Result<(), String> {
    let marker = env::var_os(HEALTH_E2E_ENV)
        .ok_or_else(|| "modo de teste ponta a ponta não habilitado".to_string())?;

    if response != HEALTH_MESSAGE {
        return Err(format!("resposta inesperada do health check: {response}"));
    }

    fs::write(
        marker,
        format!("UI -> invoke('health_check') -> Rust -> {response}"),
    )
    .map_err(|error| format!("falha ao registrar evidência do health check: {error}"))?;

    app.exit(0);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            health_check,
            confirm_health_check_e2e
        ])
        .run(tauri::generate_context!())
        .expect("falha ao executar o OPIE MVP");
}

#[cfg(test)]
mod tests {
    use super::{health_check, HEALTH_MESSAGE};

    #[test]
    fn health_check_confirma_core_ativo() {
        assert_eq!(health_check().message, HEALTH_MESSAGE);
    }
}
