import { publicApi } from '@/features/public/api';
import LandingClient from './containers/homePage/LandingClient';

// Garante que o Next.js busque os dados a cada requisição (ou defina revalidate se desejar cache)
export const revalidate = 3600; 

async function getLandingData() {
  try {
    return await publicApi.getLandingPageData();
  } catch (error) {
    console.error('Erro ao carregar dados da Landing Page:', error);
    return null;
  }
}

export default async function RootPage() {
  const data = await getLandingData();

  return <LandingClient initialData={data} />;
}