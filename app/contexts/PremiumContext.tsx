import { createContext, useState, type ReactNode } from 'react';
import { AI_MODELS, type AIModel } from '../components/chat/child-components/NavigationBar';

/* ===== Types & Interfaces ===== */
interface PremiumContextType {
	isPremiumMode: boolean;
	selectedModel: AIModel;
	setSelectedModel: (model: AIModel) => void;
	togglePremiumMode: () => void;
}

/* ===== Context ===== */
export const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

/* ===== Provider ===== */
export function PremiumProvider({ children }: { children: ReactNode }) {
	/* ===== State ===== */
	const [isPremiumMode, setIsPremiumMode] = useState(false);
	const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);

	/* ===== Functions ===== */
	const togglePremiumMode = () => {
		setIsPremiumMode(prev => !prev);
	};

	return (
		<PremiumContext.Provider
			value={{ isPremiumMode, selectedModel, setSelectedModel, togglePremiumMode }}
		>
			{children}
		</PremiumContext.Provider>
	);
}
