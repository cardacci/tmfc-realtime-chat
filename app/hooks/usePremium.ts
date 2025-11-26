import { useContext } from 'react';
import { PremiumContext } from '../contexts/PremiumContext';

export function usePremium() {
	const context = useContext(PremiumContext);

	if (!context) {
		throw new Error('usePremium must be used within PremiumProvider');
	}

	return context;
}
