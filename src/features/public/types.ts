export interface PublicPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'ANNUALLY';
  maxCourts: number | null;
  maxStaff: number | null;
}

export interface LandingPageStats {
  activeArenas: number;
  activeCourts: number;
  totalBookings: number;
}

export interface LandingPageData {
  plans: PublicPlan[];
  stats: LandingPageStats;
}

export interface CreditCardPayload {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface CreditCardHolderInfoPayload {
  name?: string;
  postalCode?: string;
  addressNumber?: string;
}

export interface CheckoutArenaPayload {
  platformPlanId: string;
  arenaName: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  cpfCnpj: string;
  phone?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  billingType: 'PIX' | 'CREDIT_CARD';
  cardId?: string;
  creditCardToken?: string;
  creditCard?: CreditCardPayload;
  creditCardHolderInfo?: CreditCardHolderInfoPayload;
}

export interface CheckoutArenaResult {
  subscriptionId: string;
  asaasSubscriptionId: string;
  billingType: 'PIX' | 'CREDIT_CARD';
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: any;
    isManager: boolean;
  };
  arena: {
    id: string;
    name: string;
  };
  pix?: {
    encodedImage: string;
    payload: string;
    expirationDate: string;
    paymentId: string;
  };
  invoiceUrl?: string;
  status?: string;
}
