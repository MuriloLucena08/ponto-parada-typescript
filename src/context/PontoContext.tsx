import React, { createContext, useContext, useState, useEffect } from 'react';
import { IPonto } from '../types/Ponto';
import { db } from '../services/db';
import { PointsService } from '../services/points';
import { useLiveQuery } from 'dexie-react-hooks';

interface PontoContextType {
    pontos: IPonto[];
    loading: boolean;
    addPonto: (ponto: IPonto) => Promise<void>;
    updatePonto: (ponto: IPonto) => Promise<void>;
    syncPontos: () => Promise<void>;
    pendingCount: number;
}

const PontoContext = createContext<PontoContextType | undefined>(undefined);

export const PontoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // Dexie live query
    const pontos = useLiveQuery(() => db.pontos.toArray(), []) || [];

    const pendingCount = pontos.filter(p => p.syncStatus === 'pending' || p.syncStatus === 'failed').length;

    const addPonto = async (ponto: IPonto) => {
        try {
            await db.pontos.add({ ...ponto, syncStatus: 'pending' });
        } catch (e) {
            console.error('Failed to add ponto', e);
            throw e;
        }
    };

    const updatePonto = async (ponto: IPonto) => {
        if (!ponto.id) return;
        try {
            await db.pontos.put(ponto);
        } catch (e) {
            console.error('Failed to update ponto', e);
            throw e;
        }
    };

    const syncPontos = async () => {
        setLoading(true);
        const pending = await db.pontos.where('syncStatus').equals('pending').toArray();
        const failed = await db.pontos.where('syncStatus').equals('failed').toArray();
        const toSync = [...pending, ...failed];

        for (const p of toSync) {
            try {
                const result = await PointsService.createPoint(p);
                if (result) {
                    await db.pontos.delete(p.id!);
                } else {
                    await db.pontos.update(p.id!, { syncStatus: 'failed' });
                }
            } catch (e) {
                await db.pontos.update(p.id!, { syncStatus: 'failed' });
            }
        }
        setLoading(false);
    };

    // Optional: Auto-sync when coming online
    useEffect(() => {
        const handleOnline = () => syncPontos();
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);

    return (
        <PontoContext.Provider value={{ pontos, addPonto, updatePonto, syncPontos, loading, pendingCount }}>
            {children}
        </PontoContext.Provider>
    );
};

export const usePonto = () => {
    const context = useContext(PontoContext);
    if (!context) throw new Error('usePonto must be used within a PontoProvider');
    return context;
};
