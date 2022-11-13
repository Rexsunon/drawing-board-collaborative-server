export class DrawPoint {
    declare points: TPoint[];
    declare color: string;
    declare size: number;
    declare filled: boolean;
    declare type: string;
    declare sides: number;
}

type TPoint = {
    dy: number,
    dx: number,
};
