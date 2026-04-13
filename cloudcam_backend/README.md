# CloudCam Backend — Guia de Instalação

## O que é isso?
Um servidor Python que faz a ponte entre o seu frontend React e a API do CloudCam.
O browser não consegue chamar o CloudCam diretamente (CORS), então este backend faz isso por você.

---

## Pré-requisito: Python instalado

Verifique no terminal:
```
python --version
```
Se aparecer `Python 3.10` ou superior, está bom.
Se não tiver Python, baixe em: https://www.python.org/downloads/

---

## Passo a passo

### 1. Coloque os arquivos numa pasta
Crie uma pasta chamada `cloudcam_backend` e coloque dentro:
- `main.py`
- `requirements.txt`

### 2. Abra o terminal dentro dessa pasta
No Windows: clique com botão direito dentro da pasta → "Abrir no Terminal"
No Mac/Linux: `cd caminho/para/cloudcam_backend`

### 3. Crie um ambiente virtual (recomendado)
```bash
python -m venv venv
```

Ative o ambiente:
- Windows:  `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

Você verá `(venv)` aparecendo no início do terminal. Isso é normal e esperado.

### 4. Instale as dependências
```bash
pip install -r requirements.txt
```
Aguarde o download. Vai instalar FastAPI, Uvicorn e Requests.

### 5. Rode o servidor
```bash
python main.py
```

Você verá algo assim:
```
🚀 Iniciando CloudCam Backend...
📖 Documentação disponível em: http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

O servidor está rodando! **Não feche o terminal.**

---

## Como testar se está funcionando

Abra o browser em: http://localhost:8000

Você verá: `{"status":"ok","message":"CloudCam Backend rodando!"}`

Abra também: http://localhost:8000/docs

Essa é a documentação interativa automática do FastAPI.
Você pode testar o login direto por lá clicando em cada rota.

---

## Rotas disponíveis

| Método | Rota | O que faz |
|--------|------|-----------|
| GET | `/` | Verifica se o servidor está no ar |
| POST | `/api/login` | Faz login no CloudCam |
| GET | `/api/cameras` | Lista as câmeras da conta |
| GET | `/api/stream/{id}` | Retorna URL do stream da câmera |
| GET | `/api/stream/{id}/proxy` | Proxia o stream HLS (resolve CORS) |
| GET | `/api/thumbnail/{id}` | Retorna a thumbnail da câmera |
| GET | `/api/status` | Verifica se há sessão ativa |
| POST | `/api/logout` | Encerra a sessão |

---

## Como o React vai chamar o backend

No seu componente React, use assim:

```javascript
// Login
const res = await fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'seu@email.com', password: 'suasenha' })
})
const data = await res.json()

// Listar câmeras
const res = await fetch('http://localhost:8000/api/cameras')
const { cameras } = await res.json()

// Obter stream de uma câmera
const res = await fetch('http://localhost:8000/api/stream/42')
const { stream_url, tipo } = await res.json()
```

---

## Problemas comuns

**`ModuleNotFoundError: No module named 'fastapi'`**
→ Rode `pip install -r requirements.txt` novamente.

**`Address already in use`**
→ A porta 8000 está ocupada. Edite `main.py` e mude `port=8000` para `port=8001`.

**Login falha mesmo com credenciais corretas**
→ O CloudCam pode ter alterado o fluxo de login. Abra um issue ou verifique o cookie CSRF.

**Stream não abre no browser (tipo RTSP)**
→ O browser não suporta RTSP. Use a rota `/proxy` ou configure transcodificação FFmpeg.
