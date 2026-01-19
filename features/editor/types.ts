export type BlockType = 'HERO' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'MAP' | 'COUNTDOWN' | 'RSVP' | 'COLUMNS';

export const DEFAULT_STYLES = {
  fontSize: 16,
  textAlign: 'center' as const,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#000000',
  backgroundColor: 'transparent',
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 10,
  paddingRight: 10,
  marginTop: 0,
  marginBottom: 0,
  borderRadius: 0,
  borderWidth: 0,
  borderColor: '#e2e8f0',
  shadow: 'none' as const,
};

export interface IBlock {
  id: string;
  type: BlockType;
  content: any;
  styles: Partial<typeof DEFAULT_STYLES>;
}

export interface IPage {
  id: string;
  title: string;
  order: number;
   styles: {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOpacity?: number;
    overlayColor?: string; 
  };
  blocks: IBlock[];
}