/* eslint-disable @typescript-eslint/ban-types */
/**
 * Všetky hodnoty do hĺbky nastaví na optional | null | undefined
 * Use cases:
 *      - Použitie pri initovaní formov
 *      - Použitie v globálnej validácií formu
 *      - Vhodné na obalenie apidoc response typu, napr. required entita môže prísť z BE ako null v prípade porušenej integrity dát na BE
 *
 * https://stackoverflow.com/a/63155849
 * https://github.com/piotrwitek/utility-types/blob/2ae7412a9edf12f34fedbf594facf43cf04f7e32/src/mapped-types.ts#L484
 */

export type DeepNil<T> = T extends Function ? T : T extends Array<infer U> ? DeepNilArray<U> : T extends object ? DeepNilObject<T> : T | null | undefined
/** @private */
// tslint:disable-next-line:class-name
export type DeepNilArray<T> = Array<DeepNil<T>>
/** @private */
export type DeepNilObject<T> = { [P in keyof T]?: DeepNil<T[P]> | null | undefined }
