import { config } from 'dotenv';
config({ path: '.env.local' });            
await import('./documentWorker.ts');       
