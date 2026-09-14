import { z } from 'zod';

export const registerArenaSchema = z.object({
  token: z.string().min(1, 'Token inválido'),
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  companyType: z.string().optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().min(10, 'Celular é obrigatório'),
  incomeValue: z.number().optional(),
  postalCode: z.string().min(8, 'CEP inválido'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  addressNumber: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  province: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'UF inválida'),
});

// Exporte o tipo inferido pelo próprio Zod
export type RegisterArenaFormData = z.infer<typeof registerArenaSchema>;