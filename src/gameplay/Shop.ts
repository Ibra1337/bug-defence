import { TowerType } from "./gameElements/towers/TowerType"
import GameState from "./GameState";

export default class Shop {

    private towerPrices = new Map<TowerType, number>([
        [TowerType.Archer, 100],
        [TowerType.Mage ,150 ],
        [TowerType.Cannon , 200]
    ]);

    public validatePurchase(gameState: GameState , towerType: TowerType): boolean{
        let p = this.towerPrices.get(towerType);
        if(!p)
            return false;
        if (gameState.getGold() < p )
            return false;

        gameState.subtractGold(p);
        return true;
    }

}