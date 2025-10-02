import { Game } from "./Game.js";
import { GameState } from "./GameState.js";
import { Zone, zoneTypes } from "./Zone.js";
import { Player } from "../GameObject/Player.js";
import type { Card } from "../GameObject/Card/Card.js";

export type PlayerInfo = {
    id: number;
    name: string;
    deck: Card[];
    sideboard: Card[];
};

export class MatchInfo {
    /** ゲームのメタ情報 */
    id: number = 0;
    playerInfo: PlayerInfo[];

    constructor(playerInfo: PlayerInfo[]) {
        this.playerInfo = playerInfo;
    }

    newGame(): Game {
        const state = new GameState();
        // プレイヤー
        state.setPlayers(this.playerInfo.map((info) => new Player(info)));
        // ターン順
        state.setTurnOrder(state.getPlayers());
        // 領域
        zoneTypes.forEach((type) => {
            if (type.hasOwner) {
                state.getPlayers().forEach((player) => {
                    state.addZone(
                        new Zone(type, type.hasOwner ? player : undefined)
                    );
                });
            } else {
                state.addZone(new Zone(type));
            }
        });
        // カード、ターン等は Game.run() へ

        const new_game = new Game(state);
        // マッチ情報
        new_game.match_info = this;
        return new_game;
    }
}
