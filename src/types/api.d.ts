import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
    namespace DeleteApiB2BAdminEnumsCategoriesCategoryId {
        namespace Parameters {
            export type CategoryID = number;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace DeleteApiB2BAdminUsersUserId {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace DeleteApiB2BV1EnumsCategoriesCategoryId {
        namespace Parameters {
            export type CategoryID = number;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace GetApiB2BAdminEnumsCategories {
        namespace Responses {
            export interface $200 {
                categories: {
                    id: number;
                    name: string;
                    parentID?: number;
                    orderIndex: number;
                    children: {
                        id: number;
                        name: string;
                        parentID?: number;
                        orderIndex: number;
                        children: {
                            id: number;
                            name: string;
                            parentID?: number;
                            orderIndex: number;
                        }[];
                    }[];
                }[];
            }
        }
    }
    namespace GetApiB2BAdminEnumsCategoriesCategoryId {
        namespace Parameters {
            export type CategoryID = number;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                    name: string;
                    parentID?: number;
                    orderIndex: number;
                    children: {
                        id: number;
                        name: string;
                        parentID?: number;
                        orderIndex: number;
                        children: {
                            id: number;
                            name: string;
                            parentID?: number;
                            orderIndex: number;
                        }[];
                    }[];
                };
            }
        }
    }
    namespace GetApiB2BAdminEnumsCountries {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        namespace Responses {
            export interface $200 {
                countries: {
                    code: string;
                    currencyCode: string;
                    flag: string;
                    phonePrefix: string;
                }[];
            }
        }
    }
    namespace GetApiB2BAdminEnumsCurrencies {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        namespace Responses {
            export interface $200 {
                currencies: {
                    code: string;
                    symbol: string;
                }[];
            }
        }
    }
    namespace GetApiB2BAdminRoles {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        namespace Responses {
            export interface $200 {
                roles: {
                    id: number;
                    name: string;
                    permissions: {
                        id: number;
                        name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                    }[];
                }[];
            }
        }
    }
    namespace GetApiB2BAdminUsers {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                users: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                    roles: {
                        id: number;
                        name: string;
                    }[];
                }[];
                pagination: {
                    limit: number;
                    page: number;
                    totalPages: number;
                    totalCount: number;
                };
            }
        }
    }
    namespace GetApiB2BAdminUsersUserId {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
            }
        }
    }
    namespace GetApiB2BV1EnumsCategories {
        namespace Responses {
            export interface $200 {
                categories: {
                    id: number;
                    name: string;
                    parentID?: number;
                    orderIndex: number;
                    children: {
                        id: number;
                        name: string;
                        parentID?: number;
                        orderIndex: number;
                        children: {
                            id: number;
                            name: string;
                            parentID?: number;
                            orderIndex: number;
                        }[];
                    }[];
                }[];
            }
        }
    }
    namespace GetApiB2BV1EnumsCategoriesCategoryId {
        namespace Parameters {
            export type CategoryID = number;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                    name: string;
                    parentID?: number;
                    orderIndex: number;
                    children: {
                        id: number;
                        name: string;
                        parentID?: number;
                        orderIndex: number;
                        children: {
                            id: number;
                            name: string;
                            parentID?: number;
                            orderIndex: number;
                        }[];
                    }[];
                };
            }
        }
    }
    namespace GetApiB2BV1EnumsCountries {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        namespace Responses {
            export interface $200 {
                countries: {
                    code: string;
                    currencyCode: string;
                    flag: string;
                    phonePrefix: string;
                }[];
            }
        }
    }
    namespace GetApiB2BV1EnumsCurrencies {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        namespace Responses {
            export interface $200 {
                currencies: {
                    code: string;
                    symbol: string;
                }[];
            }
        }
    }
    namespace GetApiB2BV1UsersUserId {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
            }
        }
    }
    namespace PatchApiB2BAdminEnumsCategoriesCategoryId {
        namespace Parameters {
            export type CategoryID = number;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        export interface RequestBody {
            name: string;
            orderIndex: number;
            parentID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminUsersUserId {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        export interface RequestBody {
            /**
             * example:
             * Janko
             */
            firstName?: string | null;
            /**
             * example:
             * Hráško
             */
            lastName?: string | null;
            /**
             * example:
             * SK
             */
            phonePrefixCountryCode?: string | null;
            /**
             * example:
             * 906047188
             */
            phone?: string | null; // ^\d+$
            company?: {
                /**
                 * example:
                 * 01234567
                 */
                businessID: string;
                /**
                 * example:
                 * SK2012345678
                 */
                vatID?: string | null;
                /**
                 * example:
                 * Company
                 */
                companyName: string;
                /**
                 * example:
                 * 010 01
                 */
                zipCode: string;
                /**
                 * example:
                 * Žilina
                 */
                city: string;
                /**
                 * example:
                 * Framborska 58
                 */
                street: string;
                /**
                 * example:
                 * SK
                 */
                countryCode: string;
            };
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1EnumsCategoriesCategoryId {
        namespace Parameters {
            export type CategoryID = number;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        export interface RequestBody {
            name: string;
            orderIndex: number;
            parentID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1UsersUserId {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        export interface RequestBody {
            /**
             * example:
             * Janko
             */
            firstName?: string | null;
            /**
             * example:
             * Hráško
             */
            lastName?: string | null;
            /**
             * example:
             * SK
             */
            phonePrefixCountryCode?: string | null;
            /**
             * example:
             * 906047188
             */
            phone?: string | null; // ^\d+$
            company?: {
                /**
                 * example:
                 * 01234567
                 */
                businessID: string;
                /**
                 * example:
                 * SK2012345678
                 */
                vatID?: string | null;
                /**
                 * example:
                 * Company
                 */
                companyName: string;
                /**
                 * example:
                 * 010 01
                 */
                zipCode: string;
                /**
                 * example:
                 * Žilina
                 */
                city: string;
                /**
                 * example:
                 * Framborska 58
                 */
                street: string;
                /**
                 * example:
                 * SK
                 */
                countryCode: string;
            };
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminAuthForgotPassword {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            /**
             * example:
             * test.confirmed_notinouser@goodrequest.com
             */
            email: string; // email
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminAuthLogin {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            /**
             * example:
             * test.confirmed_notinouser@goodrequest.com
             */
            email: string; // email
            /**
             * example:
             * Lopaty123.
             */
            password: string;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
            }
        }
    }
    namespace PostApiB2BAdminAuthLogout {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminAuthRefreshToken {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            refreshToken: string;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
            }
        }
    }
    namespace PostApiB2BAdminAuthResetPassword {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminEnumsCategories {
        export interface RequestBody {
            name: string;
            orderIndex: number;
            parentID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminUsers {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            /**
             * example:
             * test.user1@goodrequest.com
             */
            email: string; // email
            /**
             * example:
             * SK
             */
            phonePrefixCountryCode?: string | null;
            /**
             * example:
             * 906047188
             */
            phone?: string | null; // ^\d+$
            roleID: number;
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminUsersActivation {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            /**
             * example:
             * 12ABCD
             */
            code: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminUsersActivationResend {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminUsersRegistration {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            /**
             * example:
             * test.user1@goodrequest.com
             */
            email: string; // email
            /**
             * example:
             * Lopaty123.
             */
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
            /**
             * example:
             * SK
             */
            phonePrefixCountryCode: string;
            /**
             * example:
             * 906047188
             */
            phone: string; // ^\d+$
            /**
             * example:
             * true
             */
            agreeGDPR: boolean;
            /**
             * example:
             * true
             */
            agreeMarketing: boolean;
            /**
             * example:
             * true
             */
            agreeGTC: boolean;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
            }
        }
    }
    namespace PostApiB2BV1AuthForgotPassword {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            /**
             * example:
             * test.confirmed_notinouser@goodrequest.com
             */
            email: string; // email
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1AuthLogin {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            /**
             * example:
             * test.confirmed_notinouser@goodrequest.com
             */
            email: string; // email
            /**
             * example:
             * Lopaty123.
             */
            password: string;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
            }
        }
    }
    namespace PostApiB2BV1AuthLoginAsPartner {
        export interface RequestBody {
            userID: number;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
            }
        }
    }
    namespace PostApiB2BV1AuthLogout {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1AuthRefreshToken {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            refreshToken: string;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
            }
        }
    }
    namespace PostApiB2BV1AuthResetPassword {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1EnumsCategories {
        export interface RequestBody {
            name: string;
            orderIndex: number;
            parentID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1UsersActivation {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            /**
             * example:
             * 12ABCD
             */
            code: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1UsersActivationResend {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1UsersRegistration {
        export interface HeaderParameters {
            "accept-language"?: /**
             * example:
             * sk
             */
            Parameters.AcceptLanguage;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
        }
        export interface RequestBody {
            /**
             * example:
             * test.user1@goodrequest.com
             */
            email: string; // email
            /**
             * example:
             * Lopaty123.
             */
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
            /**
             * example:
             * SK
             */
            phonePrefixCountryCode: string;
            /**
             * example:
             * 906047188
             */
            phone: string; // ^\d+$
            /**
             * example:
             * true
             */
            agreeGDPR: boolean;
            /**
             * example:
             * true
             */
            agreeMarketing: boolean;
            /**
             * example:
             * true
             */
            agreeGTC: boolean;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            name: "SUPER_ADMIN" | "ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_BROWSING" | "ENUM_EDIT" | "LOGIN_AS_PARTNER";
                        }[];
                    }[];
                    company?: {
                        id: number;
                        businessID: string;
                        vatID?: string;
                        companyName: string;
                        zipCode: string;
                        city: string;
                        street: string;
                        countryCode: string;
                    };
                };
            }
        }
    }
}

export interface OperationMethods {
  /**
   * postApiB2BAdminAuthRefreshToken - PERMISSION: NO
   */
  'postApiB2BAdminAuthRefreshToken'(
    parameters?: Parameters<Paths.PostApiB2BAdminAuthRefreshToken.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminAuthRefreshToken.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthRefreshToken.Responses.$200>
  /**
   * postApiB2BAdminAuthLogout - PERMISSION: NO
   */
  'postApiB2BAdminAuthLogout'(
    parameters?: Parameters<Paths.PostApiB2BAdminAuthLogout.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminAuthLogout.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthLogout.Responses.$200>
  /**
   * postApiB2BAdminAuthForgotPassword - PERMISSION: NO
   */
  'postApiB2BAdminAuthForgotPassword'(
    parameters?: Parameters<Paths.PostApiB2BAdminAuthForgotPassword.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminAuthForgotPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthForgotPassword.Responses.$200>
  /**
   * postApiB2BAdminAuthResetPassword - PERMISSION: NO
   */
  'postApiB2BAdminAuthResetPassword'(
    parameters?: Parameters<Paths.PostApiB2BAdminAuthResetPassword.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminAuthResetPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthResetPassword.Responses.$200>
  /**
   * getApiB2BAdminUsersUserId - PERMISSION: NO
   */
  'getApiB2BAdminUsersUserId'(
    parameters?: Parameters<Paths.GetApiB2BAdminUsersUserId.PathParameters & Paths.GetApiB2BAdminUsersUserId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminUsersUserId.Responses.$200>
  /**
   * patchApiB2BAdminUsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
   */
  'patchApiB2BAdminUsersUserId'(
    parameters?: Parameters<Paths.PatchApiB2BAdminUsersUserId.PathParameters & Paths.PatchApiB2BAdminUsersUserId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminUsersUserId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminUsersUserId.Responses.$200>
  /**
   * deleteApiB2BAdminUsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_DELETE]
   */
  'deleteApiB2BAdminUsersUserId'(
    parameters?: Parameters<Paths.DeleteApiB2BAdminUsersUserId.PathParameters & Paths.DeleteApiB2BAdminUsersUserId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BAdminUsersUserId.Responses.$200>
  /**
   * postApiB2BAdminUsersRegistration - PERMISSION: NO
   */
  'postApiB2BAdminUsersRegistration'(
    parameters?: Parameters<Paths.PostApiB2BAdminUsersRegistration.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminUsersRegistration.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminUsersRegistration.Responses.$200>
  /**
   * postApiB2BAdminUsersActivation - PERMISSION: NO
   */
  'postApiB2BAdminUsersActivation'(
    parameters?: Parameters<Paths.PostApiB2BAdminUsersActivation.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminUsersActivation.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminUsersActivation.Responses.$200>
  /**
   * postApiB2BAdminUsersActivationResend - PERMISSION: NO
   */
  'postApiB2BAdminUsersActivationResend'(
    parameters?: Parameters<Paths.PostApiB2BAdminUsersActivationResend.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminUsersActivationResend.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminUsersActivationResend.Responses.$200>
  /**
   * getApiB2BAdminEnumsCountries - PERMISSION: NO
   */
  'getApiB2BAdminEnumsCountries'(
    parameters?: Parameters<Paths.GetApiB2BAdminEnumsCountries.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminEnumsCountries.Responses.$200>
  /**
   * getApiB2BAdminEnumsCurrencies - PERMISSION: NO
   */
  'getApiB2BAdminEnumsCurrencies'(
    parameters?: Parameters<Paths.GetApiB2BAdminEnumsCurrencies.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminEnumsCurrencies.Responses.$200>
  /**
   * postApiB2BV1AuthLogin - PERMISSION: NO
   */
  'postApiB2BV1AuthLogin'(
    parameters?: Parameters<Paths.PostApiB2BV1AuthLogin.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1AuthLogin.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthLogin.Responses.$200>
  /**
   * postApiB2BV1AuthRefreshToken - PERMISSION: NO
   */
  'postApiB2BV1AuthRefreshToken'(
    parameters?: Parameters<Paths.PostApiB2BV1AuthRefreshToken.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1AuthRefreshToken.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthRefreshToken.Responses.$200>
  /**
   * postApiB2BV1AuthLogout - PERMISSION: NO
   */
  'postApiB2BV1AuthLogout'(
    parameters?: Parameters<Paths.PostApiB2BV1AuthLogout.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1AuthLogout.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthLogout.Responses.$200>
  /**
   * postApiB2BV1AuthForgotPassword - PERMISSION: NO
   */
  'postApiB2BV1AuthForgotPassword'(
    parameters?: Parameters<Paths.PostApiB2BV1AuthForgotPassword.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1AuthForgotPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthForgotPassword.Responses.$200>
  /**
   * postApiB2BV1AuthResetPassword - PERMISSION: NO
   */
  'postApiB2BV1AuthResetPassword'(
    parameters?: Parameters<Paths.PostApiB2BV1AuthResetPassword.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1AuthResetPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthResetPassword.Responses.$200>
  /**
   * getApiB2BV1UsersUserId - PERMISSION: NO
   */
  'getApiB2BV1UsersUserId'(
    parameters?: Parameters<Paths.GetApiB2BV1UsersUserId.PathParameters & Paths.GetApiB2BV1UsersUserId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1UsersUserId.Responses.$200>
  /**
   * patchApiB2BV1UsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
   */
  'patchApiB2BV1UsersUserId'(
    parameters?: Parameters<Paths.PatchApiB2BV1UsersUserId.PathParameters & Paths.PatchApiB2BV1UsersUserId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1UsersUserId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1UsersUserId.Responses.$200>
  /**
   * postApiB2BV1UsersRegistration - PERMISSION: NO
   */
  'postApiB2BV1UsersRegistration'(
    parameters?: Parameters<Paths.PostApiB2BV1UsersRegistration.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1UsersRegistration.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1UsersRegistration.Responses.$200>
  /**
   * postApiB2BV1UsersActivation - PERMISSION: NO
   */
  'postApiB2BV1UsersActivation'(
    parameters?: Parameters<Paths.PostApiB2BV1UsersActivation.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1UsersActivation.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1UsersActivation.Responses.$200>
  /**
   * postApiB2BV1UsersActivationResend - PERMISSION: NO
   */
  'postApiB2BV1UsersActivationResend'(
    parameters?: Parameters<Paths.PostApiB2BV1UsersActivationResend.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1UsersActivationResend.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1UsersActivationResend.Responses.$200>
  /**
   * getApiB2BV1EnumsCountries - PERMISSION: NO
   */
  'getApiB2BV1EnumsCountries'(
    parameters?: Parameters<Paths.GetApiB2BV1EnumsCountries.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1EnumsCountries.Responses.$200>
  /**
   * getApiB2BV1EnumsCurrencies - PERMISSION: NO
   */
  'getApiB2BV1EnumsCurrencies'(
    parameters?: Parameters<Paths.GetApiB2BV1EnumsCurrencies.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1EnumsCurrencies.Responses.$200>
  /**
   * postApiB2BAdminAuthLogin - PERMISSION: NO
   */
  'postApiB2BAdminAuthLogin'(
    parameters?: Parameters<Paths.PostApiB2BAdminAuthLogin.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminAuthLogin.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthLogin.Responses.$200>
  /**
   * getApiB2BAdminUsers - PERMISSION: [SUPER_ADMIN, ADMIN, USER_BROWSING]
   */
  'getApiB2BAdminUsers'(
    parameters?: Parameters<Paths.GetApiB2BAdminUsers.QueryParameters & Paths.GetApiB2BAdminUsers.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminUsers.Responses.$200>
  /**
   * postApiB2BAdminUsers - PERMISSION: [SUPER_ADMIN, ADMIN, USER_CREATE]
   */
  'postApiB2BAdminUsers'(
    parameters?: Parameters<Paths.PostApiB2BAdminUsers.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminUsers.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminUsers.Responses.$200>
  /**
   * getApiB2BAdminEnumsCategories - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_BROWSING]
   */
  'getApiB2BAdminEnumsCategories'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminEnumsCategories.Responses.$200>
  /**
   * postApiB2BAdminEnumsCategories - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
   */
  'postApiB2BAdminEnumsCategories'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BAdminEnumsCategories.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminEnumsCategories.Responses.$200>
  /**
   * getApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_BROWSING, ENUM_EDIT]
   */
  'getApiB2BAdminEnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.GetApiB2BAdminEnumsCategoriesCategoryId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
  /**
   * patchApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
   */
  'patchApiB2BAdminEnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.PathParameters> | null,
    data?: Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
  /**
   * deleteApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
   */
  'deleteApiB2BAdminEnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
  /**
   * getApiB2BAdminRoles - PERMISSION: [SUPER_ADMIN, ADMIN, USER_CREATE]
   */
  'getApiB2BAdminRoles'(
    parameters?: Parameters<Paths.GetApiB2BAdminRoles.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminRoles.Responses.$200>
  /**
   * postApiB2BV1AuthLoginAsPartner - PERMISSION: [ADMIN, LOGIN_AS_PARTNER]
   */
  'postApiB2BV1AuthLoginAsPartner'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1AuthLoginAsPartner.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthLoginAsPartner.Responses.$200>
  /**
   * getApiB2BV1EnumsCategories - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_BROWSING]
   */
  'getApiB2BV1EnumsCategories'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1EnumsCategories.Responses.$200>
  /**
   * postApiB2BV1EnumsCategories - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
   */
  'postApiB2BV1EnumsCategories'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1EnumsCategories.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1EnumsCategories.Responses.$200>
  /**
   * getApiB2BV1EnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_BROWSING, ENUM_EDIT]
   */
  'getApiB2BV1EnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.GetApiB2BV1EnumsCategoriesCategoryId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1EnumsCategoriesCategoryId.Responses.$200>
  /**
   * patchApiB2BV1EnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
   */
  'patchApiB2BV1EnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.PatchApiB2BV1EnumsCategoriesCategoryId.PathParameters> | null,
    data?: Paths.PatchApiB2BV1EnumsCategoriesCategoryId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1EnumsCategoriesCategoryId.Responses.$200>
  /**
   * deleteApiB2BV1EnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
   */
  'deleteApiB2BV1EnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.DeleteApiB2BV1EnumsCategoriesCategoryId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BV1EnumsCategoriesCategoryId.Responses.$200>
}

export interface PathsDictionary {
  ['/api/b2b/admin/auth/refresh-token']: {
    /**
     * postApiB2BAdminAuthRefreshToken - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminAuthRefreshToken.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminAuthRefreshToken.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthRefreshToken.Responses.$200>
  }
  ['/api/b2b/admin/auth/logout']: {
    /**
     * postApiB2BAdminAuthLogout - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminAuthLogout.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminAuthLogout.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthLogout.Responses.$200>
  }
  ['/api/b2b/admin/auth/forgot-password']: {
    /**
     * postApiB2BAdminAuthForgotPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminAuthForgotPassword.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminAuthForgotPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthForgotPassword.Responses.$200>
  }
  ['/api/b2b/admin/auth/reset-password']: {
    /**
     * postApiB2BAdminAuthResetPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminAuthResetPassword.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminAuthResetPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthResetPassword.Responses.$200>
  }
  ['/api/b2b/admin/users/{userID}']: {
    /**
     * getApiB2BAdminUsersUserId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminUsersUserId.PathParameters & Paths.GetApiB2BAdminUsersUserId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminUsersUserId.Responses.$200>
    /**
     * patchApiB2BAdminUsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminUsersUserId.PathParameters & Paths.PatchApiB2BAdminUsersUserId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminUsersUserId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminUsersUserId.Responses.$200>
    /**
     * deleteApiB2BAdminUsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BAdminUsersUserId.PathParameters & Paths.DeleteApiB2BAdminUsersUserId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BAdminUsersUserId.Responses.$200>
  }
  ['/api/b2b/admin/users/registration']: {
    /**
     * postApiB2BAdminUsersRegistration - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminUsersRegistration.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminUsersRegistration.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminUsersRegistration.Responses.$200>
  }
  ['/api/b2b/admin/users/activation']: {
    /**
     * postApiB2BAdminUsersActivation - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminUsersActivation.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminUsersActivation.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminUsersActivation.Responses.$200>
  }
  ['/api/b2b/admin/users/activation-resend']: {
    /**
     * postApiB2BAdminUsersActivationResend - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminUsersActivationResend.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminUsersActivationResend.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminUsersActivationResend.Responses.$200>
  }
  ['/api/b2b/admin/enums/countries']: {
    /**
     * getApiB2BAdminEnumsCountries - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminEnumsCountries.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminEnumsCountries.Responses.$200>
  }
  ['/api/b2b/admin/enums/currencies']: {
    /**
     * getApiB2BAdminEnumsCurrencies - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminEnumsCurrencies.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminEnumsCurrencies.Responses.$200>
  }
  ['/api/b2b/v1/auth/login']: {
    /**
     * postApiB2BV1AuthLogin - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1AuthLogin.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1AuthLogin.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthLogin.Responses.$200>
  }
  ['/api/b2b/v1/auth/refresh-token']: {
    /**
     * postApiB2BV1AuthRefreshToken - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1AuthRefreshToken.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1AuthRefreshToken.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthRefreshToken.Responses.$200>
  }
  ['/api/b2b/v1/auth/logout']: {
    /**
     * postApiB2BV1AuthLogout - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1AuthLogout.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1AuthLogout.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthLogout.Responses.$200>
  }
  ['/api/b2b/v1/auth/forgot-password']: {
    /**
     * postApiB2BV1AuthForgotPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1AuthForgotPassword.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1AuthForgotPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthForgotPassword.Responses.$200>
  }
  ['/api/b2b/v1/auth/reset-password']: {
    /**
     * postApiB2BV1AuthResetPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1AuthResetPassword.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1AuthResetPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthResetPassword.Responses.$200>
  }
  ['/api/b2b/v1/users/{userID}']: {
    /**
     * getApiB2BV1UsersUserId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1UsersUserId.PathParameters & Paths.GetApiB2BV1UsersUserId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1UsersUserId.Responses.$200>
    /**
     * patchApiB2BV1UsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1UsersUserId.PathParameters & Paths.PatchApiB2BV1UsersUserId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1UsersUserId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1UsersUserId.Responses.$200>
  }
  ['/api/b2b/v1/users/registration']: {
    /**
     * postApiB2BV1UsersRegistration - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1UsersRegistration.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1UsersRegistration.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1UsersRegistration.Responses.$200>
  }
  ['/api/b2b/v1/users/activation']: {
    /**
     * postApiB2BV1UsersActivation - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1UsersActivation.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1UsersActivation.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1UsersActivation.Responses.$200>
  }
  ['/api/b2b/v1/users/activation-resend']: {
    /**
     * postApiB2BV1UsersActivationResend - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1UsersActivationResend.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1UsersActivationResend.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1UsersActivationResend.Responses.$200>
  }
  ['/api/b2b/v1/enums/countries']: {
    /**
     * getApiB2BV1EnumsCountries - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1EnumsCountries.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1EnumsCountries.Responses.$200>
  }
  ['/api/b2b/v1/enums/currencies']: {
    /**
     * getApiB2BV1EnumsCurrencies - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1EnumsCurrencies.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1EnumsCurrencies.Responses.$200>
  }
  ['/api/b2b/admin/auth/login']: {
    /**
     * postApiB2BAdminAuthLogin - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminAuthLogin.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminAuthLogin.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthLogin.Responses.$200>
  }
  ['/api/b2b/admin/users/']: {
    /**
     * getApiB2BAdminUsers - PERMISSION: [SUPER_ADMIN, ADMIN, USER_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminUsers.QueryParameters & Paths.GetApiB2BAdminUsers.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminUsers.Responses.$200>
    /**
     * postApiB2BAdminUsers - PERMISSION: [SUPER_ADMIN, ADMIN, USER_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminUsers.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminUsers.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminUsers.Responses.$200>
  }
  ['/api/b2b/admin/enums/categories/']: {
    /**
     * getApiB2BAdminEnumsCategories - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_BROWSING]
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminEnumsCategories.Responses.$200>
    /**
     * postApiB2BAdminEnumsCategories - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BAdminEnumsCategories.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminEnumsCategories.Responses.$200>
  }
  ['/api/b2b/admin/enums/categories/{categoryID}']: {
    /**
     * getApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_BROWSING, ENUM_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminEnumsCategoriesCategoryId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
    /**
     * patchApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.PathParameters> | null,
      data?: Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
    /**
     * deleteApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
  }
  ['/api/b2b/admin/roles/']: {
    /**
     * getApiB2BAdminRoles - PERMISSION: [SUPER_ADMIN, ADMIN, USER_CREATE]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminRoles.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminRoles.Responses.$200>
  }
  ['/api/b2b/v1/auth/login-as-partner']: {
    /**
     * postApiB2BV1AuthLoginAsPartner - PERMISSION: [ADMIN, LOGIN_AS_PARTNER]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1AuthLoginAsPartner.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthLoginAsPartner.Responses.$200>
  }
  ['/api/b2b/v1/enums/categories/']: {
    /**
     * getApiB2BV1EnumsCategories - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_BROWSING]
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1EnumsCategories.Responses.$200>
    /**
     * postApiB2BV1EnumsCategories - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1EnumsCategories.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1EnumsCategories.Responses.$200>
  }
  ['/api/b2b/v1/enums/categories/{categoryID}']: {
    /**
     * getApiB2BV1EnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_BROWSING, ENUM_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1EnumsCategoriesCategoryId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1EnumsCategoriesCategoryId.Responses.$200>
    /**
     * patchApiB2BV1EnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1EnumsCategoriesCategoryId.PathParameters> | null,
      data?: Paths.PatchApiB2BV1EnumsCategoriesCategoryId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1EnumsCategoriesCategoryId.Responses.$200>
    /**
     * deleteApiB2BV1EnumsCategoriesCategoryId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUM_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BV1EnumsCategoriesCategoryId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BV1EnumsCategoriesCategoryId.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
