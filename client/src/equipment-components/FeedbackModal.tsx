import { useEffect } from 'react';

interface Props {
	visible: boolean;
	message: string;
	durationMs?: number; // default 1200ms
	onDone: () => void;  // called after duration
}

export function FeedbackModal({ visible, message, durationMs = 1200, onDone }: Props) {
	useEffect(() => {
		if (!visible) return;
		const t = setTimeout(onDone, durationMs);
		return () => clearTimeout(t);
	}, [visible, durationMs, onDone]);

	if (!visible) return null;

	return (
		<div className="overlay">
			<div className="overlay-card">
				<div className="spinner" aria-hidden />
				<div className="overlay-msg">{message}</div>
			</div>
		</div>
	);
}