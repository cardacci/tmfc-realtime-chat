import type { Route } from './+types/home';
import { ChatInterface } from '../components/ChatInterface';

export function meta(_: Route.MetaArgs) {
    return [
        { title: 'MFC AI Chat - Technical Test' },
        { name: 'description', content: 'Real-time chat interface with dynamic components' },
    ];
}

export default function Home() {
    return <ChatInterface />;
}
