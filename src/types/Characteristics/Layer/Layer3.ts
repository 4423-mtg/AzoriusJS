import { type QueryParameter } from "../../Query/QueryParameter.js";
import {
    isRuleTextQuery,
    type RuleTextQuery,
} from "../../Query/SetQuery/RuleTextQuery.js";
import { isLayerCommonProperty, type LayerCommonProperty } from "./Layer.js";

/** 文章変更 */
export type Layer3<T extends QueryParameter = QueryParameter> =
    LayerCommonProperty & {
        type: "3";
        ruleText: RuleTextQuery<T>; // FIXME: 文章の型
    };
export function isLayer3(arg: unknown): arg is Layer3 {
    return (
        isLayerCommonProperty(arg) &&
        arg.type === "3" &&
        "text" in arg &&
        isRuleTextQuery(arg.text)
    );
}
