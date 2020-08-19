module UIObjects 
{
    export class Button extends Core.GameObject
    {
        // PRIVATE FIELDS (CLASS MEMBERS)

        // CONSTRUCTOR(S)
        constructor(bitmap_asset:string, x:number = 0, y:number = 0, isCentered:boolean= false)
        {
            super(bitmap_asset, x, y, isCentered)

            this.isCentered = isCentered;

            // mouse events
            this.on("mouseover", this.m_mouseOver);
    
            this.on("mouseout", this.m_mouseOut);
        }

        // PRIVATE METHOD(S)
        private m_mouseOver():void
        {
            this.alpha = 0.7; // 70% opaque - 30% transparent
        }

        private m_mouseOut():void
        {
            this.alpha = 1.0; // 100% opaque - 0% transparent
        }

        // PUBLIC METHOD(S)
    }
}