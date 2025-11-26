import { usePremium } from '../../../hooks/usePremium';

/* ===== Types & Interfaces ===== */
export interface AIModel {
	icon: string;
	id: string;
	name: string;
}

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	onToggleErrorDemo: () => void;
	showErrorDemo: boolean;
}

/* ===== Constants & Enums ===== */
export const AI_MODELS: AIModel[] = [
	{ id: 'nexus', name: 'Nexus', icon: '🔮' },
	{ id: 'gpt-4', name: 'GPT-4', icon: '🤖' },
	{ id: 'claude', name: 'Claude Sonnet', icon: '🧠' },
	{ id: 'gemini', name: 'Gemini Pro', icon: '✨' },
];

/** Sidebar menu with options and controls */
export default function Sidebar({
	isOpen,
	onClose,
	onToggleErrorDemo,
	showErrorDemo,
}: SidebarProps) {
	/* ===== Hooks ===== */
	const { isPremiumMode, selectedModel, setSelectedModel, togglePremiumMode } = usePremium();

	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<div
					aria-hidden='true'
					className='fixed inset-0 bg-opacity-20 backdrop-blur-sm z-40 transition-all duration-300 animate-fadeIn'
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className='flex flex-col h-full'>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h2 className='text-xl font-semibold text-gray-800'>Settings</h2>

						<button
							aria-label='Close menu'
							className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
							onClick={onClose}
							type='button'
						>
							<svg
								className='w-6 h-6 text-gray-600'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									d='M6 18L18 6M6 6l12 12'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
								/>
							</svg>
						</button>
					</div>

					{/* Content */}
					<div className='flex-1 overflow-y-auto p-6'>
						<div className='space-y-4'>
							{/* Premium Benefits List */}
							{isPremiumMode && (
								<div className='p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-300'>
									<div className='mb-3'>
										<h3 className='text-sm font-bold text-purple-900 mb-1 flex items-center gap-1'>
											<svg
												className='w-4 h-4 text-purple-600'
												fill='currentColor'
												viewBox='0 0 20 20'
											>
												<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
											</svg>
											Premium Benefits
										</h3>
									</div>

									<ul className='space-y-2 text-xs text-purple-800'>
										<li className='flex items-start gap-2'>
											<span className='text-purple-600 mt-0.5'>✓</span>
											<span>
												<strong>AI Model Selection:</strong> Choose between
												Nexus, GPT-4, Claude, and Gemini.
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<span className='text-purple-600 mt-0.5'>✓</span>
											<span>
												<strong>10x Message History:</strong> Access
												extended conversation records
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<span className='text-purple-600 mt-0.5'>✓</span>
											<span>
												<strong>Unlimited File Uploads:</strong> Share
												images and documents freely
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<span className='text-purple-600 mt-0.5'>✓</span>
											<span>
												<strong>Beta Access:</strong> Early access to new
												features
											</span>
										</li>
										<li className='flex items-start gap-2'>
											<span className='text-purple-600 mt-0.5'>✓</span>
											<span>
												<strong>Priority Support:</strong> Faster response
												times
											</span>
										</li>
									</ul>
								</div>
							)}

							{/* Development Testing Note */}
							<div className={isPremiumMode ? 'border-t border-gray-300 pt-4' : ''}>
								<div className='mb-3 px-2'>
									<p className='text-xs text-gray-500 italic'>
										⚙️ Development Testing Options
									</p>
								</div>

								{/* Premium Mode Toggle */}
								<div className='flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 mb-4'>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-1'>
											<h3 className='text-sm font-semibold text-purple-800'>
												Premium Mode
											</h3>

											<span className='px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-200 rounded-full'>
												DEMO
											</span>
										</div>

										<p className='text-xs text-purple-600'>
											Enable AI model selection
										</p>
									</div>

									<button
										aria-checked={isPremiumMode}
										aria-label='Toggle premium mode'
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
											isPremiumMode ? 'bg-purple-600' : 'bg-gray-300'
										}`}
										onClick={togglePremiumMode}
										role='switch'
										type='button'
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												isPremiumMode ? 'translate-x-6' : 'translate-x-1'
											}`}
										/>
									</button>
								</div>

								{/* AI Model Selector (Premium Only) */}
								{isPremiumMode && (
									<div className='p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 mb-4'>
										<div className='mb-3'>
											<h3 className='text-sm font-semibold text-purple-800 mb-1'>
												AI Model
											</h3>

											<p className='text-xs text-purple-600'>
												Select your preferred model
											</p>
										</div>

										<div className='relative'>
											<select
												className='w-full px-3 py-2 text-sm border-2 border-purple-300 rounded-lg bg-white text-purple-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none pr-8'
												onChange={e => {
													const model = AI_MODELS.find(
														m => m.id === e.target.value
													);

													if (model) {
														setSelectedModel(model);
														onClose();
													}
												}}
												value={selectedModel?.id || AI_MODELS[0].id}
											>
												{AI_MODELS.map(model => (
													<option key={model.id} value={model.id}>
														{model.icon} {model.name}
													</option>
												))}
											</select>

											{/* Custom dropdown arrow */}
											<div className='absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none'>
												<svg
													className='w-4 h-4 text-purple-600'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														d='M19 9l-7 7-7-7'
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
													/>
												</svg>
											</div>
										</div>
									</div>
								)}

								{/* Error Demo Toggle */}
								<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200'>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-1'>
											<h3 className='text-sm font-semibold text-purple-800'>
												Error Messages
											</h3>

											<span className='px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-200 rounded-full'>
												DEMO
											</span>
										</div>

										<p className='text-xs text-gray-600'>
											Show error message examples
										</p>
									</div>

									<button
										aria-checked={showErrorDemo}
										aria-label='Toggle error message demo'
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
											showErrorDemo ? 'bg-indigo-600' : 'bg-gray-300'
										}`}
										onClick={() => {
											onToggleErrorDemo();
											onClose();
										}}
										role='switch'
										type='button'
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
												showErrorDemo ? 'translate-x-6' : 'translate-x-1'
											}`}
										/>
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className='p-6 border-t border-gray-200'>
						<p className='text-xs text-gray-500 text-center'>
							The Mobile-First Company AI Chat
						</p>

						<p className='text-xs text-gray-500 text-center'>v0.0.4</p>
					</div>
				</div>
			</div>
		</>
	);
}
