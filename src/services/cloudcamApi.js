// Serviço para comunicação com o backend CloudCam
const API_BASE_URL = 'http://localhost:8000/api';

// Credenciais (hardcoded para teste)
const EMAIL = 'c0710737@vale.com';
const PASSWORD = 'Concremat@2025';

class CloudCamApi {
    constructor() {
        this.sessionActive = false;
    }

    async login() {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: EMAIL,
                    password: PASSWORD,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            this.sessionActive = true;
            console.log('✅ Login automático realizado');
            return data;
        } catch (error) {
            console.error('❌ Erro no login:', error);
            throw error;
        }
    }

    async getCameras() {
        try {
            const response = await fetch(`${API_BASE_URL}/cameras`);

            if (!response.ok) {
                throw new Error('Failed to fetch cameras');
            }

            const data = await response.json();
            return data.cameras;
        } catch (error) {
            console.error('❌ Erro ao buscar câmeras:', error);
            throw error;
        }
    }

    async getStreamInfo(cameraId) {
        try {
            const response = await fetch(`${API_BASE_URL}/stream/${cameraId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch stream info');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Erro ao buscar stream:', error);
            throw error;
        }
    }

    async getThumbnailUrl(cameraId) {
        return `${API_BASE_URL}/thumbnail/${cameraId}`;
    }
}

export default new CloudCamApi();