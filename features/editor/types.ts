

export type BlockType = 
  | 'HERO' 
  | 'TEXT' 
  | 'IMAGE' 
  | 'VIDEO' 
  | 'MAP' 
  | 'COUNTDOWN' 
  | 'RSVP' 
  | 'COLUMNS'
  | 'MENU'; // Adicionado para suportar o futuro bloco de Menu

export type AnimationType = 
  | 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
  | 'zoom-in' | 'zoom-out' | 'bounce' | 'flip';

export type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted' | 'double';

export const DEFAULT_STYLES = {

  videoAutoplay: false,
  videoLoop: false,
  videoMuted: false,     
  videoControls: true,
  
  // --- Tipografia Base ---
  fontSize: 16,
  textAlign: 'center' as const, 
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#1e293b', 
  fontFamily: 'inherit',
  
  // --- Container Global (Dimensões e Fundo) ---
  backgroundColor: 'transparent',
  width: '100%',      
  height: 'auto',     
  objectFit: 'cover',
  
  // --- Box Model (Espaçamento) ---
  paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0,
  marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
  
  // --- Decoração Global (Bordas e Sombra) ---
  borderRadius: 0,
  borderWidth: 0,
  borderStyle: 'solid' as BorderStyle, 
  borderColor: '#e2e8f0',
  shadow: 'none' as const,

  // --- ESTILOS ESPECÍFICOS (ITEMS INTERNOS) ---
  
  // 1. Itens do Cronómetro (Caixas dos números)
  itemBackgroundColor: 'transparent',
  itemColor: 'inherit',
  itemBorderRadius: 8,
  itemBorderWidth: 1,
  itemBorderColor: '#000000',
  itemBorderStyle: 'solid' as BorderStyle,
  itemShadow: 'none' as const, 
  
  // 2. Inputs (Campos de texto do RSVP)
  inputBackgroundColor: '#ffffff',
  inputTextColor: '#000000',
  inputBorderColor: '#e2e8f0',
  inputBorderRadius: 8,
  inputBorderWidth: 1,              
  inputBorderStyle: 'solid' as BorderStyle,
  inputShadow: 'none' as const, 
  
  // 3. Botões (Botão do RSVP e Link do Mapa)
  btnBackgroundColor: '#000000',
  btnTextColor: '#ffffff',
  btnRadius: 8,
  btnBorderWidth: 0,                
  btnBorderColor: 'transparent',    
  btnBorderStyle: 'solid' as BorderStyle, 
  btnShadow: 'none' as const, 
 
  // --- Animação ---
  animation: 'none' as AnimationType,
  animationDuration: 0.5,
  animationDelay: 0,
};

export const DEFAULT_PAGE_STYLES = {
  backgroundColor: "#ffffff",
  backgroundOpacity: 0,
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

export interface IBlock {
  id: string;
  type: BlockType;
  content: any;
  styles: Partial<typeof DEFAULT_STYLES> & {
    animation?: AnimationType;
  };
}

export interface IPage {
  id: string;
  title: string;
  order: number;
  styles: {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOpacity?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
  blocks: IBlock[];
}