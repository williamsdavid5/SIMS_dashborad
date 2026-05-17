import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext({});

export function AppProvider({ children }) {
    const [ocorrencias, setOcorrencias] = useState([]);
    const [loadingOcorrencias, setLoadingOcorrencias] = useState(false);
    const [errorOcorrencias, setErrorOcorrencias] = useState(null);

    const fetchOcorrencias = useCallback(async () => {
        setLoadingOcorrencias(true);
        setErrorOcorrencias(null);
        try {
            const response = await api.get('/ocorrencias');
            setOcorrencias(response.data);
        } catch (err) {
            console.error("Erro ao buscar ocorrências:", err);
            setErrorOcorrencias(err.message || 'Erro ao carregar ocorrências.');
        } finally {
            setLoadingOcorrencias(false);
        }
    }, []);

    return (
        <AppContext.Provider
            value={{
                ocorrencias,
                loadingOcorrencias,
                errorOcorrencias,
                fetchOcorrencias,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp deve ser usado dentro de um AppProvider');
    }
    return context;
}