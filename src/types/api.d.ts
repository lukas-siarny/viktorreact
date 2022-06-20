import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
    namespace DeleteApiB2BAdminCustomersCustomerId {
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
            export type CustomerID = number;
        }
        export interface PathParameters {
            customerID: Parameters.CustomerID;
        }
        namespace Responses {
            export interface $200 {
                customer?: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace DeleteApiB2BAdminEmployeesEmployeeId {
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
            export type EmployeeID = number;
        }
        export interface PathParameters {
            employeeID: Parameters.EmployeeID;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace DeleteApiB2BAdminEnumsCategoriesCategoryId {
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
            export type CategoryID = number;
            export type Restore = boolean;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        export interface QueryParameters {
            restore: Parameters.Restore;
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
    namespace DeleteApiB2BAdminSalonsSalonId {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace DeleteApiB2BAdminServicesServiceId {
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
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        namespace Responses {
            export interface $200 {
                service?: {
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
    namespace DeleteApiB2BV1CustomersCustomerId {
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
            export type CustomerID = number;
        }
        export interface PathParameters {
            customerID: Parameters.CustomerID;
        }
        namespace Responses {
            export interface $200 {
                customer?: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace DeleteApiB2BV1EmployeesEmployeeId {
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
            export type EmployeeID = number;
        }
        export interface PathParameters {
            employeeID: Parameters.EmployeeID;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace DeleteApiB2BV1PushNotificationsUnsubscribeDeviceId {
        namespace Parameters {
            /**
             * example:
             * 12DXXS
             */
            export type DeviceID = string;
        }
        export interface PathParameters {
            deviceID: /**
             * example:
             * 12DXXS
             */
            Parameters.DeviceID;
        }
        namespace Responses {
            export type $200 = "";
        }
    }
    namespace DeleteApiB2BV1SalonsSalonId {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace DeleteApiB2BV1ServicesServiceId {
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
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        namespace Responses {
            export interface $200 {
                service?: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace DeleteApiB2BV1UsersUserId {
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
    namespace GetApiB2BAdminCustomers {
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
            export type Limit = 25 | 50 | 100 | 1000;
            export type Order = string;
            export type Page = number;
            export type SalonID = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            salonID?: Parameters.SalonID;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                customers: {
                    id: number;
                    firstName: string;
                    lastName: string;
                    email?: string;
                    phonePrefixCountryCode?: string;
                    phone: string; // ^\d+$
                    gender?: "MALE" | "FEMALE";
                    address: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
    namespace GetApiB2BAdminCustomersCustomerId {
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
            export type CustomerID = number;
        }
        export interface PathParameters {
            customerID: Parameters.CustomerID;
        }
        namespace Responses {
            export interface $200 {
                customer: {
                    id: number;
                    firstName: string;
                    lastName: string;
                    email?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    gender?: "MALE" | "FEMALE";
                    address: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BAdminEmployees {
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
            export type SalonID = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            salonID?: Parameters.SalonID;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                employees: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        firstName?: string;
                        lastName?: string;
                        email: string;
                        image: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
    namespace GetApiB2BAdminEmployeesEmployeeId {
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
            export type EmployeeID = number;
        }
        export interface PathParameters {
            employeeID: Parameters.EmployeeID;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    description?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        email?: string;
                        lastAccess?: string; // date-time
                        activateAt?: string; // date-time
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        hasBasicInfo: boolean;
                        roles: {
                            id: number;
                            name?: string;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        }[];
                        salons: {
                            id: number;
                            employeeID: number;
                            role?: {
                                id: number;
                                permissions: {
                                    id: number;
                                    name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                                }[];
                            };
                        }[];
                        disabledNotificationTypes?: ("TEST")[];
                        image?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        createdAt: string; // date-time
                        updatedAt: string; // date-time
                        deletedAt?: string; // date-time
                    };
                    role?: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BAdminEnumsCategories {
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
                categories: {
                    id: number;
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    parentID?: number;
                    orderIndex: number;
                    children: {
                        id: number;
                        name?: string;
                        nameLocalizations: {
                            language: "sk" | "cs" | "en";
                            value: string | null;
                        }[];
                        parentID?: number;
                        orderIndex: number;
                        children: {
                            id: number;
                            name?: string;
                            nameLocalizations: {
                                language: "sk" | "cs" | "en";
                                value: string | null;
                            }[];
                            parentID?: number;
                            orderIndex: number;
                            deletedAt?: string; // date-time
                        }[];
                        deletedAt?: string; // date-time
                    }[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    } | {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiB2BAdminEnumsCategoriesCategoryId {
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
            export type CategoryID = number;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    parentID?: number;
                    orderIndex: number;
                    children: {
                        id: number;
                        name?: string;
                        nameLocalizations: {
                            language: "sk" | "cs" | "en";
                            value: string | null;
                        }[];
                        parentID?: number;
                        orderIndex: number;
                        children: {
                            id: number;
                            name?: string;
                            nameLocalizations: {
                                language: "sk" | "cs" | "en";
                                value: string | null;
                            }[];
                            parentID?: number;
                            orderIndex: number;
                            deletedAt?: string; // date-time
                        }[];
                        deletedAt?: string; // date-time
                    }[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    } | {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    currencyCode: string | null;
                    flag?: string;
                    phonePrefix: string;
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiB2BAdminRolesSalon {
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
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    permissions: {
                        id: number;
                        name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                    }[];
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiB2BAdminRolesSystemUser {
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
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    permissions: {
                        id: number;
                        name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                    }[];
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiB2BAdminSalons {
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
            export type CategoryFirstLevelIDs = number[];
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type Search = string | null;
            export type Statuses = ("PUBLISHED" | "NOT_PUBLISHED" | "NOT_VISIBLE" | "VISIBLE" | "DELETED" | "NOT_DELETED" | "ALL")[];
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            categoryFirstLevelIDs?: Parameters.CategoryFirstLevelIDs;
            statuses?: Parameters.Statuses;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                salons: {
                    id: number;
                    name?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    email?: string;
                    address?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                        latitude?: number; // float
                        longitude?: number; // float
                    };
                    categories: {
                        id: number;
                        name?: string;
                    }[];
                    isPublished: boolean;
                    isVisible: boolean;
                    fillingProgressSalon: boolean;
                    fillingProgressServices: boolean;
                    fillingProgressCompany: boolean;
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
    namespace GetApiB2BAdminSalonsSalonId {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                    name?: string;
                    aboutUsFirst?: string;
                    aboutUsSecond?: string;
                    openingHours?: {
                        /**
                         * example:
                         * MONDAY
                         */
                        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                        timeRanges: [
                            {
                                /**
                                 * example:
                                 * 07:00
                                 */
                                timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                /**
                                 * example:
                                 * 15:00
                                 */
                                timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            },
                            ...{
                                /**
                                 * example:
                                 * 07:00
                                 */
                                timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                /**
                                 * example:
                                 * 15:00
                                 */
                                timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            }[]
                        ];
                    }[];
                    openingHoursNote?: {
                        /**
                         * example:
                         * Poznámka
                         */
                        note: string;
                        /**
                         * example:
                         * 2022-03-22
                         */
                        validFrom: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        /**
                         * example:
                         * 2022-03-22
                         */
                        validTo: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                    };
                    address?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                        latitude?: number; // float
                        longitude?: number; // float
                    };
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    email?: string;
                    socialLinkFB?: string;
                    socialLinkInstagram?: string;
                    socialLinkWebPage?: string;
                    payByCard?: boolean;
                    otherPaymentMethods?: string;
                    categories: {
                        id: number;
                        name?: string;
                    }[];
                    isPublished: boolean;
                    isVisible: boolean;
                    fillingProgressSalon: boolean;
                    fillingProgressServices: boolean;
                    fillingProgressCompany: boolean;
                    images: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    }[];
                    logo?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    pricelists: {
                        id: number;
                        original: string;
                    }[];
                    companyContactPerson?: {
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                    };
                    companyInvoiceAddress?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    companyInfo?: {
                        businessID?: string;
                        taxID?: string;
                        vatID?: string;
                        companyName?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BAdminServices {
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
            export type CategoryID = number;
            export type EmployeeID = number;
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type SalonID = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            categoryID?: Parameters.CategoryID;
            employeeID?: Parameters.EmployeeID;
            salonID?: Parameters.SalonID;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                services: {
                    id: number;
                    name: string;
                    durationFrom: number;
                    durationTo?: number;
                    priceFrom: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    priceTo?: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    employees: {
                        id: number;
                        firstName: string;
                        lastName: string;
                        image: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                    }[];
                    category: {
                        id: number;
                        name?: string;
                        child: {
                            id: number;
                            name?: string;
                            child?: {
                                id: number;
                                name?: string;
                            };
                        };
                    };
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
    namespace GetApiB2BAdminServicesServiceId {
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
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        namespace Responses {
            export interface $200 {
                service: {
                    id: number;
                    name: string;
                    description?: string;
                    durationFrom: number;
                    durationTo?: number;
                    priceFrom: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    priceTo?: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    employees: {
                        id: number;
                        fullName: string;
                        image: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                    }[];
                    category: {
                        id: number;
                        name?: string;
                        child: {
                            id: number;
                            name?: string;
                            child?: {
                                id: number;
                                name?: string;
                            };
                        };
                    };
                    images: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    }[];
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
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
            export type RoleID = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            roleID?: Parameters.RoleID;
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
                    roles: {
                        id: number;
                        name?: string;
                    }[];
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BV1Customers {
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
            export type Limit = 25 | 50 | 100 | 1000;
            export type Order = string;
            export type Page = number;
            export type SalonID = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            salonID?: Parameters.SalonID;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                customers: {
                    id: number;
                    firstName: string;
                    lastName: string;
                    email?: string;
                    phonePrefixCountryCode?: string;
                    phone: string; // ^\d+$
                    gender?: "MALE" | "FEMALE";
                    address: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
    namespace GetApiB2BV1CustomersCustomerId {
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
            export type CustomerID = number;
        }
        export interface PathParameters {
            customerID: Parameters.CustomerID;
        }
        namespace Responses {
            export interface $200 {
                customer: {
                    id: number;
                    firstName: string;
                    lastName: string;
                    email?: string;
                    phonePrefixCountryCode: string;
                    phone: string; // ^\d+$
                    gender?: "MALE" | "FEMALE";
                    address: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BV1Employees {
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
            export type SalonID = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            salonID?: Parameters.SalonID;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                employees: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        firstName?: string;
                        lastName?: string;
                        email: string;
                        image: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
    namespace GetApiB2BV1EmployeesEmployeeId {
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
            export type EmployeeID = number;
        }
        export interface PathParameters {
            employeeID: Parameters.EmployeeID;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    description?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        email?: string;
                        lastAccess?: string; // date-time
                        activateAt?: string; // date-time
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        hasBasicInfo: boolean;
                        roles: {
                            id: number;
                            name?: string;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        }[];
                        salons: {
                            id: number;
                            employeeID: number;
                            role?: {
                                id: number;
                                permissions: {
                                    id: number;
                                    name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                                }[];
                            };
                        }[];
                        disabledNotificationTypes?: ("TEST")[];
                        image?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        createdAt: string; // date-time
                        updatedAt: string; // date-time
                        deletedAt?: string; // date-time
                    };
                    role?: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BV1EnumsCategories {
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
                categories: {
                    id: number;
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    parentID?: number;
                    orderIndex: number;
                    children: {
                        id: number;
                        name?: string;
                        nameLocalizations: {
                            language: "sk" | "cs" | "en";
                            value: string | null;
                        }[];
                        parentID?: number;
                        orderIndex: number;
                        children: {
                            id: number;
                            name?: string;
                            nameLocalizations: {
                                language: "sk" | "cs" | "en";
                                value: string | null;
                            }[];
                            parentID?: number;
                            orderIndex: number;
                            deletedAt?: string; // date-time
                        }[];
                        deletedAt?: string; // date-time
                    }[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    } | {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiB2BV1EnumsCategoriesCategoryId {
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
            export type CategoryID = number;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        namespace Responses {
            export interface $200 {
                category: {
                    id: number;
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    parentID?: number;
                    orderIndex: number;
                    children: {
                        id: number;
                        name?: string;
                        nameLocalizations: {
                            language: "sk" | "cs" | "en";
                            value: string | null;
                        }[];
                        parentID?: number;
                        orderIndex: number;
                        children: {
                            id: number;
                            name?: string;
                            nameLocalizations: {
                                language: "sk" | "cs" | "en";
                                value: string | null;
                            }[];
                            parentID?: number;
                            orderIndex: number;
                            deletedAt?: string; // date-time
                        }[];
                        deletedAt?: string; // date-time
                    }[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    } | {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    currencyCode: string | null;
                    flag?: string;
                    phonePrefix: string;
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiB2BV1RolesSalon {
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
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    permissions: {
                        id: number;
                        name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                    }[];
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiB2BV1Salons {
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
                salons: {
                    id: number;
                    name?: string;
                    fillingProgressSalon: boolean;
                    fillingProgressServices: boolean;
                    fillingProgressCompany: boolean;
                    images: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    }[];
                    logo?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    address?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                        latitude?: number; // float
                        longitude?: number; // float
                    };
                    categories: {
                        id: number;
                        name?: string;
                    }[];
                    isPublished: boolean;
                    isVisible: boolean;
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiB2BV1SalonsPreview {
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
                salon: {
                    id: number;
                    fillingProgressSalon: boolean;
                    fillingProgressServices: boolean;
                    fillingProgressCompany: boolean;
                    categorySegment?: {
                        categories: {
                            id: number;
                            name?: string;
                        }[];
                    };
                    gallerySegment?: {
                        images: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        }[];
                        logo?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                    };
                    nameSegment?: {
                        name: string;
                    };
                    openingHoursSegment?: {
                        openingHours: [
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            }
                        ];
                        openingHoursNote?: {
                            /**
                             * example:
                             * Poznámka
                             */
                            note: string;
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validFrom: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validTo: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        };
                    };
                    aboutUsSegment?: {
                        aboutUsFirst?: string;
                        aboutUsSecond?: string;
                    };
                    contactInfoSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                        latitude?: number; // float
                        longitude?: number; // float
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        email?: string;
                        socialLinkFB?: string;
                        socialLinkInstagram?: string;
                        socialLinkWebPage?: string;
                    };
                    paymentSegment?: {
                        payByCard?: boolean;
                        otherPaymentMethods?: string;
                    };
                    companyContactPersonSegment?: {
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                    };
                    companyInvoiceAddressSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    companyInfoSegment?: {
                        businessID?: string;
                        taxID?: string;
                        vatID?: string;
                        companyName?: string;
                    };
                    pricelistSegment?: {
                        pricelists: {
                            id: number;
                            original: string;
                        }[];
                    };
                    createdAt?: string; // date-time
                    updatedAt?: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BV1SalonsSalonId {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                    fillingProgressSalon: boolean;
                    fillingProgressServices: boolean;
                    fillingProgressCompany: boolean;
                    categorySegment?: {
                        categories: {
                            id: number;
                            name?: string;
                        }[];
                    };
                    gallerySegment?: {
                        images: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        }[];
                        logo?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                    };
                    nameSegment?: {
                        name: string;
                    };
                    openingHoursSegment?: {
                        openingHours: [
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            }
                        ];
                        openingHoursNote?: {
                            /**
                             * example:
                             * Poznámka
                             */
                            note: string;
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validFrom: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validTo: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        };
                    };
                    aboutUsSegment?: {
                        aboutUsFirst?: string;
                        aboutUsSecond?: string;
                    };
                    contactInfoSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                        latitude?: number; // float
                        longitude?: number; // float
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        email?: string;
                        socialLinkFB?: string;
                        socialLinkInstagram?: string;
                        socialLinkWebPage?: string;
                    };
                    paymentSegment?: {
                        payByCard?: boolean;
                        otherPaymentMethods?: string;
                    };
                    companyContactPersonSegment?: {
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                    };
                    companyInvoiceAddressSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    companyInfoSegment?: {
                        businessID?: string;
                        taxID?: string;
                        vatID?: string;
                        companyName?: string;
                    };
                    pricelistSegment?: {
                        pricelists: {
                            id: number;
                            original: string;
                        }[];
                    };
                    createdAt?: string; // date-time
                    updatedAt?: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BV1SalonsSalonIdDashboard {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                    isVisible: boolean;
                    groupedServicesByCategory: {
                        category: {
                            id: number;
                            name?: string;
                        };
                        groupedServicesByCategory: {
                            category: {
                                id: number;
                                name?: string;
                            };
                            servicesCount: number;
                        }[];
                    }[];
                };
            }
        }
    }
    namespace GetApiB2BV1Services {
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
            export type RootCategoryID = number;
            export type SalonID = number;
        }
        export interface QueryParameters {
            rootCategoryID?: Parameters.RootCategoryID;
            salonID?: Parameters.SalonID;
        }
        namespace Responses {
            export interface $200 {
                groupedServicesByCategory: {
                    category: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        durationFrom: number;
                        durationTo?: number;
                        priceFrom: {
                            /**
                             * example:
                             * EUR
                             */
                            currency: string;
                            /**
                             * example:
                             * -1
                             */
                            exponent: number;
                            /**
                             * example:
                             * 23
                             */
                            significand: number;
                        };
                        priceTo?: {
                            /**
                             * example:
                             * EUR
                             */
                            currency: string;
                            /**
                             * example:
                             * -1
                             */
                            exponent: number;
                            /**
                             * example:
                             * 23
                             */
                            significand: number;
                        };
                        employeesCount: number;
                        employees: {
                            id: number;
                            firstName: string;
                            lastName: string;
                            image: {
                                id: number;
                                original: string;
                                resizedImages: {
                                    [key: string]: any;
                                };
                            };
                        }[];
                        category: {
                            id: number;
                            name?: string;
                            child: {
                                id: number;
                                name?: string;
                                child?: {
                                    id: number;
                                    name?: string;
                                };
                            };
                        };
                        salon: {
                            id: number;
                            name: string;
                        };
                        createdAt: string; // date-time
                        updatedAt: string; // date-time
                        deletedAt?: string; // date-time
                    }[];
                }[];
            }
        }
    }
    namespace GetApiB2BV1ServicesServiceId {
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
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        namespace Responses {
            export interface $200 {
                service: {
                    id: number;
                    name: string;
                    description?: string;
                    durationFrom: number;
                    durationTo?: number;
                    priceFrom: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    priceTo?: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    employees: {
                        id: number;
                        fullName: string;
                        image: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                    }[];
                    category: {
                        id: number;
                        name?: string;
                        child: {
                            id: number;
                            name?: string;
                            child?: {
                                id: number;
                                name?: string;
                            };
                        };
                    };
                    images: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    }[];
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BV1UsersPartners {
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
            export type Page = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                users: {
                    id: number;
                    email: string;
                    fullName?: string;
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace GetApiB2BV1UsersUserIdPendingEmployeeInvites {
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
                pendingEmployeeInvites: {
                    salon: {
                        id: number;
                        name?: string;
                    };
                }[];
            }
        }
    }
    namespace GetApiB2CV1EnumsCategories {
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
                categories: {
                    id: number;
                    name?: string;
                    nameLocalizations: {
                        language: "sk" | "cs" | "en";
                        value: string | null;
                    }[];
                    parentID?: number;
                    orderIndex: number;
                    children: {
                        id: number;
                        name?: string;
                        nameLocalizations: {
                            language: "sk" | "cs" | "en";
                            value: string | null;
                        }[];
                        parentID?: number;
                        orderIndex: number;
                        children: {
                            id: number;
                            name?: string;
                            nameLocalizations: {
                                language: "sk" | "cs" | "en";
                                value: string | null;
                            }[];
                            parentID?: number;
                            orderIndex: number;
                            deletedAt?: string; // date-time
                        }[];
                        deletedAt?: string; // date-time
                    }[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    } | {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiB2CV1Salons {
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
            export type CategoryIDs = number[];
            export type LatMy = number; // float
            export type LatNW = number; // float
            export type LatSE = number; // float
            export type Limit = 20;
            export type LonMy = number; // float
            export type LonNW = number; // float
            export type LonSE = number; // float
            export type Page = number;
        }
        export interface QueryParameters {
            latNW: Parameters.LatNW /* float */;
            lonNW: Parameters.LonNW /* float */;
            latSE: Parameters.LatSE /* float */;
            lonSE: Parameters.LonSE /* float */;
            latMy?: Parameters.LatMy /* float */;
            lonMy?: Parameters.LonMy /* float */;
            categoryIDs?: Parameters.CategoryIDs;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                salons: {
                    id: number;
                    name: string;
                    logo?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    distance?: number; // float
                    openingHours: string;
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
    namespace GetApiB2CV1SalonsFilter {
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
            export type LatMy = number; // float
            export type LatNW = number; // float
            export type LatSE = number; // float
            export type LonMy = number; // float
            export type LonNW = number; // float
            export type LonSE = number; // float
            export type Search = string;
        }
        export interface QueryParameters {
            latNW: Parameters.LatNW /* float */;
            lonNW: Parameters.LonNW /* float */;
            latSE: Parameters.LatSE /* float */;
            lonSE: Parameters.LonSE /* float */;
            latMy?: Parameters.LatMy /* float */;
            lonMy?: Parameters.LonMy /* float */;
            search: Parameters.Search;
        }
        namespace Responses {
            export interface $200 {
                cities: {
                    name: string;
                    placeID: string;
                }[];
                salons: {
                    id: number;
                    name: string;
                    distance?: number; // float
                    lat: number; // float
                    lon: number; // float
                    address?: {
                        city?: string;
                        street?: string;
                    };
                }[];
                categories: {
                    id: number;
                    name?: string;
                }[];
            }
        }
    }
    namespace GetApiB2CV1SalonsFilterCitiesPlaceId {
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
            export type PlaceID = string;
        }
        export interface PathParameters {
            placeID: Parameters.PlaceID;
        }
        namespace Responses {
            export interface $200 {
                city?: {
                    placeID: string;
                    lat?: number; // float
                    lon?: number; // float
                };
            }
        }
    }
    namespace GetApiB2CV1SalonsMap {
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
            export type CategoryIDs = number[];
            export type LatMy = number; // float
            export type LatNW = number; // float
            export type LatSE = number; // float
            export type LonMy = number; // float
            export type LonNW = number; // float
            export type LonSE = number; // float
        }
        export interface QueryParameters {
            latNW: Parameters.LatNW /* float */;
            lonNW: Parameters.LonNW /* float */;
            latSE: Parameters.LatSE /* float */;
            lonSE: Parameters.LonSE /* float */;
            latMy?: Parameters.LatMy /* float */;
            lonMy?: Parameters.LonMy /* float */;
            categoryIDs?: Parameters.CategoryIDs;
        }
        namespace Responses {
            export interface $200 {
                mapPoints: {
                    lat: number; // float
                    lon: number; // float
                    salon: {
                        id: number;
                        name: string;
                        logo?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        distance?: number; // float
                        liked?: boolean;
                        openingHours: string;
                    };
                }[];
            }
        }
    }
    namespace GetApiB2CV1SalonsSalonId {
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
            export type LatMy = number; // float
            export type LonMy = number; // float
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface QueryParameters {
            latMy?: Parameters.LatMy /* float */;
            lonMy?: Parameters.LonMy /* float */;
        }
        namespace Responses {
            export interface $200 {
                id: number;
                name?: string;
                aboutUsFirst?: string;
                aboutUsSecond?: string;
                countryCode?: string;
                zipCode?: string;
                city?: string;
                street?: string;
                phonePrefixCountryCode?: string;
                phone?: string; // ^\d+$
                email?: string;
                socialLinkFB?: string;
                socialLinkInstagram?: string;
                socialLinkWebPage?: string;
                payByCard?: boolean;
                otherPaymentMethods?: string;
                liked: boolean;
                distance?: number; // float
                travelTime?: number;
                openingHours: [
                    {
                        date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        isCurrentDate: boolean;
                        isOpen: boolean;
                        /**
                         * example:
                         * MONDAY
                         */
                        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                        timeRanges: {
                            timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        }[];
                    },
                    {
                        date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        isCurrentDate: boolean;
                        isOpen: boolean;
                        /**
                         * example:
                         * MONDAY
                         */
                        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                        timeRanges: {
                            timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        }[];
                    },
                    {
                        date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        isCurrentDate: boolean;
                        isOpen: boolean;
                        /**
                         * example:
                         * MONDAY
                         */
                        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                        timeRanges: {
                            timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        }[];
                    },
                    {
                        date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        isCurrentDate: boolean;
                        isOpen: boolean;
                        /**
                         * example:
                         * MONDAY
                         */
                        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                        timeRanges: {
                            timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        }[];
                    },
                    {
                        date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        isCurrentDate: boolean;
                        isOpen: boolean;
                        /**
                         * example:
                         * MONDAY
                         */
                        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                        timeRanges: {
                            timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        }[];
                    },
                    {
                        date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        isCurrentDate: boolean;
                        isOpen: boolean;
                        /**
                         * example:
                         * MONDAY
                         */
                        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                        timeRanges: {
                            timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        }[];
                    },
                    {
                        date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        isCurrentDate: boolean;
                        isOpen: boolean;
                        /**
                         * example:
                         * MONDAY
                         */
                        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                        timeRanges: {
                            timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        }[];
                    }
                ];
                openingHoursNote?: {
                    /**
                     * example:
                     * Poznámka
                     */
                    note: string;
                    /**
                     * example:
                     * 2022-03-22
                     */
                    validFrom: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                    /**
                     * example:
                     * 2022-03-22
                     */
                    validTo: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                };
                images: {
                    id: number;
                    original: string;
                    resizedImages: {
                        [key: string]: any;
                    };
                }[];
                logo?: {
                    id: number;
                    original: string;
                    resizedImages: {
                        [key: string]: any;
                    };
                };
                pricelists: {
                    id: number;
                    original: string;
                }[];
                employees: {
                    id: number;
                    firstName?: string;
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                }[];
                services: {
                    id: number;
                    name: string;
                    description?: string;
                    durationFrom: number;
                    durationTo?: number;
                    priceFrom: number; // float
                    priceTo?: number; // float
                }[];
            }
        }
    }
    namespace GetApiB2CV1SalonsSalonIdEmployees {
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
            export type Limit = 25 | 50 | 100 | 1000;
            export type Page = number;
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                employees: {
                    id: number;
                    firstName?: string;
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                }[];
            }
        }
    }
    namespace GetApiB2CV1SalonsSalonIdServices {
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
            export type Limit = 25 | 50 | 100 | 1000;
            export type Page = number;
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                services: {
                    id: number;
                    name: string;
                    description?: string;
                    durationFrom: number;
                    durationTo?: number;
                    priceFrom: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    priceTo?: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminAuthChangePassword {
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
             * Lopaty123.
             */
            oldPassword: string;
            /**
             * example:
             * Lopaty123.
             */
            newPassword: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
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
    namespace PatchApiB2BAdminCustomersCustomerId {
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
            export type CustomerID = number;
        }
        export interface PathParameters {
            customerID: Parameters.CustomerID;
        }
        export interface RequestBody {
            /**
             * example:
             * Janko
             */
            firstName: string;
            /**
             * example:
             * Hráško
             */
            lastName: string;
            /**
             * example:
             * test.user1@goodrequest.com
             */
            email?: string | null; // email
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
            gender?: "MALE" | "FEMALE";
            /**
             * example:
             * SK
             */
            countryCode?: string | null;
            /**
             * example:
             * 010 01
             */
            zipCode?: string | null;
            /**
             * example:
             * Žilina
             */
            city?: string | null;
            /**
             * example:
             * Framborska 58
             */
            street?: string | null;
            /**
             * example:
             * 1
             */
            streetNumber?: string | null;
        }
        namespace Responses {
            export interface $200 {
                customer?: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminEmployeesEmployeeId {
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
            export type EmployeeID = number;
        }
        export interface PathParameters {
            employeeID: Parameters.EmployeeID;
        }
        export interface RequestBody {
            /**
             * example:
             * Janko
             */
            firstName: string;
            /**
             * example:
             * Hráško
             */
            lastName: string;
            /**
             * example:
             * popis
             */
            description?: string | null;
            /**
             * example:
             * janko.hrasko@goodrequest.com
             */
            email?: string | null; // email
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
            services?: {
                /**
                 * example:
                 * 1
                 */
                id: number;
                employeeData?: {
                    /**
                     * example:
                     * 10
                     */
                    durationFrom?: number;
                    /**
                     * example:
                     * 10
                     */
                    durationTo?: number;
                    priceFrom?: {
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    } | null;
                    priceTo?: {
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    } | null;
                } | null;
            }[] | null;
            /**
             * example:
             * 1
             */
            imageID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    description?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        email?: string;
                        lastAccess?: string; // date-time
                        activateAt?: string; // date-time
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        hasBasicInfo: boolean;
                        roles: {
                            id: number;
                            name?: string;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        }[];
                        salons: {
                            id: number;
                            employeeID: number;
                            role?: {
                                id: number;
                                permissions: {
                                    id: number;
                                    name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                                }[];
                            };
                        }[];
                        disabledNotificationTypes?: ("TEST")[];
                        image?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        createdAt: string; // date-time
                        updatedAt: string; // date-time
                        deletedAt?: string; // date-time
                    };
                    role?: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminEmployeesEmployeeIdRole {
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
            export type EmployeeID = number;
        }
        export interface PathParameters {
            employeeID: Parameters.EmployeeID;
        }
        export interface RequestBody {
            roleID: number;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    description?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        email?: string;
                        lastAccess?: string; // date-time
                        activateAt?: string; // date-time
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        hasBasicInfo: boolean;
                        roles: {
                            id: number;
                            name?: string;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        }[];
                        salons: {
                            id: number;
                            employeeID: number;
                            role?: {
                                id: number;
                                permissions: {
                                    id: number;
                                    name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                                }[];
                            };
                        }[];
                        disabledNotificationTypes?: ("TEST")[];
                        image?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        createdAt: string; // date-time
                        updatedAt: string; // date-time
                        deletedAt?: string; // date-time
                    };
                    role?: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminEnumsCategoriesCategoryId {
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
            export type CategoryID = number;
        }
        export interface PathParameters {
            categoryID: Parameters.CategoryID;
        }
        export interface RequestBody {
            nameLocalizations: ({
                language: "en";
                value: string;
            } | {
                language: "sk" | "cs";
                value?: string | null;
            })[];
            orderIndex: number;
            parentID?: null | number;
            imageID?: number | number;
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
    namespace PatchApiB2BAdminSalonsSalonId {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            /**
             * example:
             * Salon 1
             */
            name: string;
            /**
             * example:
             * some text
             */
            aboutUsFirst?: string | null;
            /**
             * example:
             * some text
             */
            aboutUsSecond?: string | null;
            openingHours: {
                /**
                 * example:
                 * MONDAY
                 */
                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                timeRanges: [
                    {
                        /**
                         * example:
                         * 07:00
                         */
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        /**
                         * example:
                         * 15:00
                         */
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    },
                    ...{
                        /**
                         * example:
                         * 07:00
                         */
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        /**
                         * example:
                         * 15:00
                         */
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[]
                ];
            }[];
            /**
             * example:
             * SK
             */
            countryCode: string;
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
             * 1
             */
            streetNumber?: string;
            /**
             * example:
             * 49.226666
             */
            latitude: number; // float
            /**
             * example:
             * 18.7348681
             */
            longitude: number; // float
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
             * test_notino@goodrequest.com
             */
            email: string; // email
            /**
             * example:
             * https://www.facebook.com/GoodRequestCom
             */
            socialLinkFB?: string | null;
            /**
             * example:
             * https://www.instagram.com/goodrequest/
             */
            socialLinkInstagram?: string | null;
            /**
             * example:
             * https://www.goodrequest.com/
             */
            socialLinkWebPage?: string | null;
            /**
             * example:
             * true
             */
            payByCard: boolean;
            /**
             * example:
             * Prevod na účet
             */
            otherPaymentMethods?: string | null;
            imageIDs: [
                number,
                ...number[]
            ];
            /**
             * example:
             * 1
             */
            logoID?: null | number;
            /**
             * example:
             * 1
             */
            pricelistIDs?: number[];
            companyContactPerson: {
                /**
                 * example:
                 * test_notino@goodrequest.com
                 */
                email: string; // email
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
                phonePrefixCountryCode: string;
                /**
                 * example:
                 * 906047188
                 */
                phone: string; // ^\d+$
            };
            companyInfo: {
                /**
                 * example:
                 * 01234567
                 */
                businessID: string;
                /**
                 * example:
                 * 2012345678
                 */
                taxID: string;
                /**
                 * example:
                 * SK2012345678
                 */
                vatID: string;
                /**
                 * example:
                 * Company
                 */
                companyName: string;
            };
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminSalonsSalonIdInvoice {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            companyInvoiceAddress: {
                /**
                 * example:
                 * SK
                 */
                countryCode: string;
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
                 * 1
                 */
                streetNumber?: string;
            };
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminSalonsSalonIdOpenHoursNote {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            openingHoursNote: {
                /**
                 * example:
                 * Poznámka
                 */
                note: string;
                /**
                 * example:
                 * 2022-03-22
                 */
                validFrom: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                /**
                 * example:
                 * 2022-03-22
                 */
                validTo: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
            } | null;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminSalonsSalonIdPublish {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            publish: boolean;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminSalonsSalonIdVisible {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            visible: boolean;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BAdminServicesServiceId {
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
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        export interface RequestBody {
            /**
             * example:
             * Služba 1
             */
            name: string;
            /**
             * example:
             * some text
             */
            description?: string | null;
            /**
             * example:
             * 10
             */
            durationFrom: number;
            /**
             * example:
             * 10
             */
            durationTo?: null | number;
            priceFrom: {
                /**
                 * example:
                 * -1
                 */
                exponent: number;
                /**
                 * example:
                 * 23
                 */
                significand: number;
            };
            priceTo?: {
                /**
                 * example:
                 * -1
                 */
                exponent: number;
                /**
                 * example:
                 * 23
                 */
                significand: number;
            } | null;
            /**
             * example:
             * 1
             */
            categoryID: number;
            employeeIDs?: number[] | null;
            imageIDs?: number[] | null;
        }
        namespace Responses {
            export interface $200 {
                service: {
                    id: number;
                    name: string;
                    description?: string;
                    durationFrom: number;
                    durationTo?: number;
                    priceFrom: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    priceTo?: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    employees: {
                        id: number;
                        fullName: string;
                        image: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                    }[];
                    category: {
                        id: number;
                        name?: string;
                        child: {
                            id: number;
                            name?: string;
                            child?: {
                                id: number;
                                name?: string;
                            };
                        };
                    };
                    images: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    }[];
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
            /**
             * example:
             * 1
             */
            imageID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1AuthChangePassword {
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
             * Lopaty123.
             */
            oldPassword: string;
            /**
             * example:
             * Lopaty123.
             */
            newPassword: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
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
    namespace PatchApiB2BV1CustomersCustomerId {
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
            export type CustomerID = number;
        }
        export interface PathParameters {
            customerID: Parameters.CustomerID;
        }
        export interface RequestBody {
            /**
             * example:
             * Janko
             */
            firstName: string;
            /**
             * example:
             * Hráško
             */
            lastName: string;
            /**
             * example:
             * test.user1@goodrequest.com
             */
            email?: string | null; // email
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
            gender?: "MALE" | "FEMALE";
            /**
             * example:
             * SK
             */
            countryCode?: string | null;
            /**
             * example:
             * 010 01
             */
            zipCode?: string | null;
            /**
             * example:
             * Žilina
             */
            city?: string | null;
            /**
             * example:
             * Framborska 58
             */
            street?: string | null;
            /**
             * example:
             * 1
             */
            streetNumber?: string | null;
        }
        namespace Responses {
            export interface $200 {
                customer?: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1EmployeesEmployeeId {
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
            export type EmployeeID = number;
        }
        export interface PathParameters {
            employeeID: Parameters.EmployeeID;
        }
        export interface RequestBody {
            /**
             * example:
             * Janko
             */
            firstName: string;
            /**
             * example:
             * Hráško
             */
            lastName: string;
            /**
             * example:
             * popis
             */
            description?: string | null;
            /**
             * example:
             * janko.hrasko@goodrequest.com
             */
            email?: string | null; // email
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
            services?: {
                /**
                 * example:
                 * 1
                 */
                id: number;
                employeeData?: {
                    /**
                     * example:
                     * 10
                     */
                    durationFrom?: number;
                    /**
                     * example:
                     * 10
                     */
                    durationTo?: number;
                    priceFrom?: {
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    } | null;
                    priceTo?: {
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    } | null;
                } | null;
            }[] | null;
            /**
             * example:
             * 1
             */
            imageID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    description?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        email?: string;
                        lastAccess?: string; // date-time
                        activateAt?: string; // date-time
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        hasBasicInfo: boolean;
                        roles: {
                            id: number;
                            name?: string;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        }[];
                        salons: {
                            id: number;
                            employeeID: number;
                            role?: {
                                id: number;
                                permissions: {
                                    id: number;
                                    name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                                }[];
                            };
                        }[];
                        disabledNotificationTypes?: ("TEST")[];
                        image?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        createdAt: string; // date-time
                        updatedAt: string; // date-time
                        deletedAt?: string; // date-time
                    };
                    role?: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1EmployeesEmployeeIdRole {
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
            export type EmployeeID = number;
        }
        export interface PathParameters {
            employeeID: Parameters.EmployeeID;
        }
        export interface RequestBody {
            roleID: number;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    description?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        email?: string;
                        lastAccess?: string; // date-time
                        activateAt?: string; // date-time
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        hasBasicInfo: boolean;
                        roles: {
                            id: number;
                            name?: string;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        }[];
                        salons: {
                            id: number;
                            employeeID: number;
                            role?: {
                                id: number;
                                permissions: {
                                    id: number;
                                    name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                                }[];
                            };
                        }[];
                        disabledNotificationTypes?: ("TEST")[];
                        image?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        createdAt: string; // date-time
                        updatedAt: string; // date-time
                        deletedAt?: string; // date-time
                    };
                    role?: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1SalonsSalonId {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            gallerySegment?: {
                imageIDs: [
                    number,
                    ...number[]
                ];
                /**
                 * example:
                 * 1
                 */
                logoID?: null | number;
            } | null;
            nameSegment?: {
                /**
                 * example:
                 * Salon 1
                 */
                name: string;
            } | null;
            openingHoursSegment?: {
                openingHours: {
                    /**
                     * example:
                     * MONDAY
                     */
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    timeRanges: [
                        {
                            /**
                             * example:
                             * 07:00
                             */
                            timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            /**
                             * example:
                             * 15:00
                             */
                            timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        },
                        ...{
                            /**
                             * example:
                             * 07:00
                             */
                            timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            /**
                             * example:
                             * 15:00
                             */
                            timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        }[]
                    ];
                }[];
                openingHoursNote?: {
                    /**
                     * example:
                     * Poznámka
                     */
                    note: string;
                    /**
                     * example:
                     * 2022-03-22
                     */
                    validFrom?: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                    /**
                     * example:
                     * 2022-03-22
                     */
                    validTo?: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                } | null;
            } | null;
            aboutUsSegment?: {
                /**
                 * example:
                 * some text
                 */
                aboutUsFirst?: string | null;
                /**
                 * example:
                 * some text
                 */
                aboutUsSecond?: string | null;
            } | null;
            contactInfoSegment?: {
                /**
                 * example:
                 * SK
                 */
                countryCode: string;
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
                 * 1
                 */
                streetNumber?: string;
                /**
                 * example:
                 * 49.226666
                 */
                latitude: number; // float
                /**
                 * example:
                 * 18.7348681
                 */
                longitude: number; // float
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
                 * test_notino@goodrequest.com
                 */
                email: string; // email
                /**
                 * example:
                 * https://www.facebook.com/GoodRequestCom
                 */
                socialLinkFB?: string | null;
                /**
                 * example:
                 * https://www.instagram.com/goodrequest/
                 */
                socialLinkInstagram?: string | null;
                /**
                 * example:
                 * https://www.goodrequest.com/
                 */
                socialLinkWebPage?: string | null;
            } | null;
            paymentSegment?: {
                /**
                 * example:
                 * true
                 */
                payByCard: boolean;
                /**
                 * example:
                 * Prevod na účet
                 */
                otherPaymentMethods?: string | null;
            } | null;
            companyContactPersonSegment?: {
                /**
                 * example:
                 * test_notino@goodrequest.com
                 */
                email: string; // email
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
                phonePrefixCountryCode: string;
                /**
                 * example:
                 * 906047188
                 */
                phone: string; // ^\d+$
            };
            companyInfoSegment?: {
                /**
                 * example:
                 * 01234567
                 */
                businessID: string;
                /**
                 * example:
                 * 2012345678
                 */
                taxID: string;
                /**
                 * example:
                 * SK2012345678
                 */
                vatID: string;
                /**
                 * example:
                 * Company
                 */
                companyName: string;
            };
            pricelistSegment?: {
                /**
                 * example:
                 * 1
                 */
                pricelistIDs?: number[];
            };
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                    fillingProgressSalon: boolean;
                    fillingProgressServices: boolean;
                    fillingProgressCompany: boolean;
                    categorySegment?: {
                        categories: {
                            id: number;
                            name?: string;
                        }[];
                    };
                    gallerySegment?: {
                        images: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        }[];
                        logo?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                    };
                    nameSegment?: {
                        name: string;
                    };
                    openingHoursSegment?: {
                        openingHours: [
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            }
                        ];
                        openingHoursNote?: {
                            /**
                             * example:
                             * Poznámka
                             */
                            note: string;
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validFrom: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validTo: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        };
                    };
                    aboutUsSegment?: {
                        aboutUsFirst?: string;
                        aboutUsSecond?: string;
                    };
                    contactInfoSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                        latitude?: number; // float
                        longitude?: number; // float
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        email?: string;
                        socialLinkFB?: string;
                        socialLinkInstagram?: string;
                        socialLinkWebPage?: string;
                    };
                    paymentSegment?: {
                        payByCard?: boolean;
                        otherPaymentMethods?: string;
                    };
                    companyContactPersonSegment?: {
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                    };
                    companyInvoiceAddressSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    companyInfoSegment?: {
                        businessID?: string;
                        taxID?: string;
                        vatID?: string;
                        companyName?: string;
                    };
                    pricelistSegment?: {
                        pricelists: {
                            id: number;
                            original: string;
                        }[];
                    };
                    createdAt?: string; // date-time
                    updatedAt?: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1SalonsSalonIdAcceptEmployeeInvite {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            /**
             * example:
             * true
             */
            accept: boolean;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1SalonsSalonIdInvoice {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            companyInvoiceAddressSegment: {
                /**
                 * example:
                 * SK
                 */
                countryCode: string;
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
                 * 1
                 */
                streetNumber?: string;
            };
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                    fillingProgressSalon: boolean;
                    fillingProgressServices: boolean;
                    fillingProgressCompany: boolean;
                    categorySegment?: {
                        categories: {
                            id: number;
                            name?: string;
                        }[];
                    };
                    gallerySegment?: {
                        images: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        }[];
                        logo?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                    };
                    nameSegment?: {
                        name: string;
                    };
                    openingHoursSegment?: {
                        openingHours: [
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            }
                        ];
                        openingHoursNote?: {
                            /**
                             * example:
                             * Poznámka
                             */
                            note: string;
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validFrom: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validTo: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        };
                    };
                    aboutUsSegment?: {
                        aboutUsFirst?: string;
                        aboutUsSecond?: string;
                    };
                    contactInfoSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                        latitude?: number; // float
                        longitude?: number; // float
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        email?: string;
                        socialLinkFB?: string;
                        socialLinkInstagram?: string;
                        socialLinkWebPage?: string;
                    };
                    paymentSegment?: {
                        payByCard?: boolean;
                        otherPaymentMethods?: string;
                    };
                    companyContactPersonSegment?: {
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                    };
                    companyInvoiceAddressSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    companyInfoSegment?: {
                        businessID?: string;
                        taxID?: string;
                        vatID?: string;
                        companyName?: string;
                    };
                    pricelistSegment?: {
                        pricelists: {
                            id: number;
                            original: string;
                        }[];
                    };
                    createdAt?: string; // date-time
                    updatedAt?: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1SalonsSalonIdPublish {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            publish: boolean;
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2BV1ServicesServiceId {
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
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        export interface RequestBody {
            /**
             * example:
             * Služba 1
             */
            name: string;
            /**
             * example:
             * some text
             */
            description?: string | null;
            /**
             * example:
             * 10
             */
            durationFrom: number;
            /**
             * example:
             * 10
             */
            durationTo?: null | number;
            priceFrom: {
                /**
                 * example:
                 * -1
                 */
                exponent: number;
                /**
                 * example:
                 * 23
                 */
                significand: number;
            };
            priceTo?: {
                /**
                 * example:
                 * -1
                 */
                exponent: number;
                /**
                 * example:
                 * 23
                 */
                significand: number;
            } | null;
            /**
             * example:
             * 1
             */
            categoryID: number;
            employeeIDs?: number[] | null;
            imageIDs?: number[] | null;
        }
        namespace Responses {
            export interface $200 {
                service: {
                    id: number;
                    name: string;
                    description?: string;
                    durationFrom: number;
                    durationTo?: number;
                    priceFrom: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    priceTo?: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    employees: {
                        id: number;
                        fullName: string;
                        image: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                    }[];
                    category: {
                        id: number;
                        name?: string;
                        child: {
                            id: number;
                            name?: string;
                            child?: {
                                id: number;
                                name?: string;
                            };
                        };
                    };
                    images: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    }[];
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
            disabledNotificationTypes?: ("TEST")[];
            /**
             * example:
             * 1
             */
            imageID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PatchApiB2CV1SalonsSalonIdLike {
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
            export type SalonID = number;
        }
        export interface PathParameters {
            salonID: Parameters.SalonID;
        }
        export interface RequestBody {
            like: boolean;
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
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
            /**
             * example:
             * Lopaty123.
             */
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminCustomers {
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
             * Janko
             */
            firstName: string;
            /**
             * example:
             * Hráško
             */
            lastName: string;
            /**
             * example:
             * test.user1@goodrequest.com
             */
            email?: string | null; // email
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
            gender?: "MALE" | "FEMALE";
            /**
             * example:
             * SK
             */
            countryCode?: string | null;
            /**
             * example:
             * 010 01
             */
            zipCode?: string | null;
            /**
             * example:
             * Žilina
             */
            city?: string | null;
            /**
             * example:
             * Framborska 58
             */
            street?: string | null;
            /**
             * example:
             * 1
             */
            streetNumber?: string;
            salonID: number;
        }
        namespace Responses {
            export interface $200 {
                customer?: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminEmployees {
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
             * Janko
             */
            firstName: string;
            /**
             * example:
             * Hráško
             */
            lastName: string;
            /**
             * example:
             * popis
             */
            description?: string | null;
            /**
             * example:
             * janko.hrasko@goodrequest.com
             */
            email?: string | null; // email
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
            services?: {
                /**
                 * example:
                 * 1
                 */
                id: number;
                employeeData?: {
                    /**
                     * example:
                     * 10
                     */
                    durationFrom?: number;
                    /**
                     * example:
                     * 10
                     */
                    durationTo?: number;
                    priceFrom?: {
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    } | null;
                    priceTo?: {
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    } | null;
                } | null;
            }[] | null;
            /**
             * example:
             * 1
             */
            salonID: number;
            /**
             * example:
             * 1
             */
            imageID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    description?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        email?: string;
                        lastAccess?: string; // date-time
                        activateAt?: string; // date-time
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        hasBasicInfo: boolean;
                        roles: {
                            id: number;
                            name?: string;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        }[];
                        salons: {
                            id: number;
                            employeeID: number;
                            role?: {
                                id: number;
                                permissions: {
                                    id: number;
                                    name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                                }[];
                            };
                        }[];
                        disabledNotificationTypes?: ("TEST")[];
                        image?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        createdAt: string; // date-time
                        updatedAt: string; // date-time
                        deletedAt?: string; // date-time
                    };
                    role?: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminEmployeesInvite {
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
             * janko.hrasko@goodrequest.com
             */
            inviteEmail: string; // email
            /**
             * example:
             * 1
             */
            employeeID?: null | number;
            /**
             * example:
             * 1
             */
            salonID: number;
            /**
             * example:
             * 1
             */
            roleID: number;
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
    namespace PostApiB2BAdminEnumsCategories {
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
            nameLocalizations: ({
                language: "en";
                value: string;
            } | {
                language: "sk" | "cs";
                value?: string | null;
            })[];
            orderIndex: number;
            parentID?: null | number;
            imageID?: number | number;
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
    namespace PostApiB2BAdminFilesSignUrls {
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
            files: [
                {
                    /**
                     * example:
                     * test.pdf
                     */
                    name: string;
                    /**
                     * example:
                     * 1024
                     */
                    size: number;
                    /**
                     * example:
                     * application/pdf
                     */
                    mimeType: string;
                },
                ...{
                    /**
                     * example:
                     * test.pdf
                     */
                    name: string;
                    /**
                     * example:
                     * 1024
                     */
                    size: number;
                    /**
                     * example:
                     * application/pdf
                     */
                    mimeType: string;
                }[]
            ];
            /**
             *  <span> Category is used to validate file (allowed mimetypes, max size, ...) and to determine, where can uploaded file be used (it is validated when files are assigned to other entities). For example file with SALON_IMAGE category can be used as image of salon, logo of salon or image of service<br><br> Category-entity usage </span> <div> <table> <thead> <tr> <th>category</th> <th>entity</th> </tr> </thead> <tbody> <tr> <td>SALON_IMAGE</td> <td>salon images</td> </tr> <tr> <td></td> <td>salon logo</td> </tr> <tr> <td></td> <td>service images</td> </tr> <tr> <td>EMPLOYEE_IMAGE</td> <td>employee image</td> </tr> <tr> <td>USER_IMAGE</td> <td>user image</td> </tr> <tr> <td>SALON_PRICELIST</td> <td>salon pricelists</td> </tr> <tr> <td>CATEGORY_IMAGE</td> <td>category image</td> </tr> </tbody> </table> </div>
             */
            category: "SALON_IMAGE" | "EMPLOYEE_IMAGE" | "USER_IMAGE" | "SALON_PRICELIST" | "CATEGORY_IMAGE";
        }
        namespace Responses {
            export interface $200 {
                files: {
                    id: number;
                    path: string;
                    signedUrl: string;
                    resizedImages?: {
                        [key: string]: any;
                    };
                }[];
            }
        }
    }
    namespace PostApiB2BAdminSalons {
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
             * Salon 1
             */
            name: string;
            /**
             * example:
             * some text
             */
            aboutUsFirst?: string | null;
            /**
             * example:
             * some text
             */
            aboutUsSecond?: string | null;
            openingHours: {
                /**
                 * example:
                 * MONDAY
                 */
                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                timeRanges: [
                    {
                        /**
                         * example:
                         * 07:00
                         */
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        /**
                         * example:
                         * 15:00
                         */
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    },
                    ...{
                        /**
                         * example:
                         * 07:00
                         */
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        /**
                         * example:
                         * 15:00
                         */
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[]
                ];
            }[];
            /**
             * example:
             * SK
             */
            countryCode: string;
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
             * 1
             */
            streetNumber?: string;
            /**
             * example:
             * 49.226666
             */
            latitude: number; // float
            /**
             * example:
             * 18.7348681
             */
            longitude: number; // float
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
             * test_notino@goodrequest.com
             */
            email: string; // email
            /**
             * example:
             * https://www.facebook.com/GoodRequestCom
             */
            socialLinkFB?: string | null;
            /**
             * example:
             * https://www.instagram.com/goodrequest/
             */
            socialLinkInstagram?: string | null;
            /**
             * example:
             * https://www.goodrequest.com/
             */
            socialLinkWebPage?: string | null;
            /**
             * example:
             * true
             */
            payByCard: boolean;
            /**
             * example:
             * Prevod na účet
             */
            otherPaymentMethods?: string | null;
            imageIDs: [
                number,
                ...number[]
            ];
            /**
             * example:
             * 1
             */
            logoID?: null | number;
            /**
             * example:
             * 1
             */
            pricelistIDs?: number[];
            companyContactPerson: {
                /**
                 * example:
                 * test_notino@goodrequest.com
                 */
                email: string; // email
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
                phonePrefixCountryCode: string;
                /**
                 * example:
                 * 906047188
                 */
                phone: string; // ^\d+$
            };
            companyInfo: {
                /**
                 * example:
                 * 01234567
                 */
                businessID: string;
                /**
                 * example:
                 * 2012345678
                 */
                taxID: string;
                /**
                 * example:
                 * SK2012345678
                 */
                vatID: string;
                /**
                 * example:
                 * Company
                 */
                companyName: string;
            };
        }
        namespace Responses {
            export interface $200 {
                salon: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BAdminServices {
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
             * Služba 1
             */
            name: string;
            /**
             * example:
             * some text
             */
            description?: string | null;
            /**
             * example:
             * 10
             */
            durationFrom: number;
            /**
             * example:
             * 10
             */
            durationTo?: null | number;
            priceFrom: {
                /**
                 * example:
                 * -1
                 */
                exponent: number;
                /**
                 * example:
                 * 23
                 */
                significand: number;
            };
            priceTo?: {
                /**
                 * example:
                 * -1
                 */
                exponent: number;
                /**
                 * example:
                 * 23
                 */
                significand: number;
            } | null;
            /**
             * example:
             * 1
             */
            salonID: number;
            /**
             * example:
             * 1
             */
            categoryID: number;
            employeeIDs?: number[] | null;
            imageIDs?: number[] | null;
        }
        namespace Responses {
            export interface $200 {
                service: {
                    id: number;
                    name: string;
                    description?: string;
                    durationFrom: number;
                    durationTo?: number;
                    priceFrom: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    priceTo?: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    employees: {
                        id: number;
                        fullName: string;
                        image: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                    }[];
                    category: {
                        id: number;
                        name?: string;
                        child: {
                            id: number;
                            name?: string;
                            child?: {
                                id: number;
                                name?: string;
                            };
                        };
                    };
                    images: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    }[];
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
            /**
             * example:
             * 1
             */
            imageID?: null | number;
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
                user: {
                    id: number;
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
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
            /**
             * example:
             * 1
             */
            imageID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
            }
        }
    }
    namespace PostApiB2BV1AuthLoginAsPartner {
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
            userID: number;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
            "device-id": /**
             * example:
             * 12DXXS
             */
            Parameters.DeviceId;
        }
        namespace Parameters {
            /**
             * example:
             * sk
             */
            export type AcceptLanguage = string;
            /**
             * example:
             * 12DXXS
             */
            export type DeviceId = string;
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
            /**
             * example:
             * Lopaty123.
             */
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1Customers {
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
             * Janko
             */
            firstName: string;
            /**
             * example:
             * Hráško
             */
            lastName: string;
            /**
             * example:
             * test.user1@goodrequest.com
             */
            email?: string | null; // email
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
            gender?: "MALE" | "FEMALE";
            /**
             * example:
             * SK
             */
            countryCode?: string | null;
            /**
             * example:
             * 010 01
             */
            zipCode?: string | null;
            /**
             * example:
             * Žilina
             */
            city?: string | null;
            /**
             * example:
             * Framborska 58
             */
            street?: string | null;
            /**
             * example:
             * 1
             */
            streetNumber?: string;
            salonID: number;
        }
        namespace Responses {
            export interface $200 {
                customer?: {
                    id: number;
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1Employees {
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
             * Janko
             */
            firstName: string;
            /**
             * example:
             * Hráško
             */
            lastName: string;
            /**
             * example:
             * popis
             */
            description?: string | null;
            /**
             * example:
             * janko.hrasko@goodrequest.com
             */
            email?: string | null; // email
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
            services?: {
                /**
                 * example:
                 * 1
                 */
                id: number;
                employeeData?: {
                    /**
                     * example:
                     * 10
                     */
                    durationFrom?: number;
                    /**
                     * example:
                     * 10
                     */
                    durationTo?: number;
                    priceFrom?: {
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    } | null;
                    priceTo?: {
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    } | null;
                } | null;
            }[] | null;
            /**
             * example:
             * 1
             */
            salonID: number;
            /**
             * example:
             * 1
             */
            imageID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                employee: {
                    id: number;
                    firstName?: string;
                    lastName?: string;
                    description?: string;
                    email?: string;
                    inviteEmail?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasActiveAccount: boolean;
                    salon: {
                        id: number;
                        name?: string;
                    };
                    services: {
                        id: number;
                        name: string;
                        description?: string;
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        salonData: {
                            durationFrom: number;
                            durationTo?: number;
                            priceFrom: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                        category: {
                            id: number;
                            name?: string;
                            children: {
                                id: number;
                                name?: string;
                            }[];
                        };
                    }[];
                    image: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    user?: {
                        id: number;
                        email?: string;
                        lastAccess?: string; // date-time
                        activateAt?: string; // date-time
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        hasBasicInfo: boolean;
                        roles: {
                            id: number;
                            name?: string;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        }[];
                        salons: {
                            id: number;
                            employeeID: number;
                            role?: {
                                id: number;
                                permissions: {
                                    id: number;
                                    name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                                }[];
                            };
                        }[];
                        disabledNotificationTypes?: ("TEST")[];
                        image?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        createdAt: string; // date-time
                        updatedAt: string; // date-time
                        deletedAt?: string; // date-time
                    };
                    role?: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1EmployeesInvite {
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
             * janko.hrasko@goodrequest.com
             */
            inviteEmail: string; // email
            /**
             * example:
             * 1
             */
            employeeID?: null | number;
            /**
             * example:
             * 1
             */
            salonID: number;
            /**
             * example:
             * 1
             */
            roleID: number;
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
    namespace PostApiB2BV1FilesSignUrls {
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
            files: [
                {
                    /**
                     * example:
                     * test.pdf
                     */
                    name: string;
                    /**
                     * example:
                     * 1024
                     */
                    size: number;
                    /**
                     * example:
                     * application/pdf
                     */
                    mimeType: string;
                },
                ...{
                    /**
                     * example:
                     * test.pdf
                     */
                    name: string;
                    /**
                     * example:
                     * 1024
                     */
                    size: number;
                    /**
                     * example:
                     * application/pdf
                     */
                    mimeType: string;
                }[]
            ];
            /**
             *  <span> Category is used to validate file (allowed mimetypes, max size, ...) and to determine, where can uploaded file be used (it is validated when files are assigned to other entities). For example file with SALON_IMAGE category can be used as image of salon, logo of salon or image of service<br><br> Category-entity usage </span> <div> <table> <thead> <tr> <th>category</th> <th>entity</th> </tr> </thead> <tbody> <tr> <td>SALON_IMAGE</td> <td>salon images</td> </tr> <tr> <td></td> <td>salon logo</td> </tr> <tr> <td></td> <td>service images</td> </tr> <tr> <td>EMPLOYEE_IMAGE</td> <td>employee image</td> </tr> <tr> <td>USER_IMAGE</td> <td>user image</td> </tr> <tr> <td>SALON_PRICELIST</td> <td>salon pricelists</td> </tr> <tr> <td>CATEGORY_IMAGE</td> <td>category image</td> </tr> </tbody> </table> </div>
             */
            category: "SALON_IMAGE" | "EMPLOYEE_IMAGE" | "USER_IMAGE" | "SALON_PRICELIST" | "CATEGORY_IMAGE";
        }
        namespace Responses {
            export interface $200 {
                files: {
                    id: number;
                    path: string;
                    signedUrl: string;
                    resizedImages?: {
                        [key: string]: any;
                    };
                }[];
            }
        }
    }
    namespace PostApiB2BV1PushNotificationsSubscribe {
        export interface HeaderParameters {
            "accept-language": /**
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
             * 12DXXS
             */
            deviceID: string;
            /**
             * example:
             * abc
             */
            token: string;
            /**
             * example:
             * ANDROID
             */
            platform: "IOS" | "ANDROID";
            /**
             * example:
             * DEBUG
             */
            mode: "DEBUG" | "RELEASE";
            /**
             * example:
             * Samsung A50
             */
            name?: string | null;
        }
        namespace Responses {
            export type $200 = "";
        }
    }
    namespace PostApiB2BV1Salons {
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
                salon: {
                    id: number;
                    fillingProgressSalon: boolean;
                    fillingProgressServices: boolean;
                    fillingProgressCompany: boolean;
                    categorySegment?: {
                        categories: {
                            id: number;
                            name?: string;
                        }[];
                    };
                    gallerySegment?: {
                        images: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        }[];
                        logo?: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                    };
                    nameSegment?: {
                        name: string;
                    };
                    openingHoursSegment?: {
                        openingHours: [
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            },
                            {
                                date: string; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                                isCurrentDate: boolean;
                                isOpen: boolean;
                                /**
                                 * example:
                                 * MONDAY
                                 */
                                day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                                timeRanges: {
                                    timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                    timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                }[];
                            }
                        ];
                        openingHoursNote?: {
                            /**
                             * example:
                             * Poznámka
                             */
                            note: string;
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validFrom: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                            /**
                             * example:
                             * 2022-03-22
                             */
                            validTo: string | null; // ^(\d{4})[-]((0[1-9])|(1[012]))[-]((0[1-9])|([12][0-9])|(3[01]))$
                        };
                    };
                    aboutUsSegment?: {
                        aboutUsFirst?: string;
                        aboutUsSecond?: string;
                    };
                    contactInfoSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                        latitude?: number; // float
                        longitude?: number; // float
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                        email?: string;
                        socialLinkFB?: string;
                        socialLinkInstagram?: string;
                        socialLinkWebPage?: string;
                    };
                    paymentSegment?: {
                        payByCard?: boolean;
                        otherPaymentMethods?: string;
                    };
                    companyContactPersonSegment?: {
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        phonePrefixCountryCode?: string;
                        phone?: string; // ^\d+$
                    };
                    companyInvoiceAddressSegment?: {
                        countryCode?: string;
                        zipCode?: string;
                        city?: string;
                        street?: string;
                        streetNumber?: string;
                    };
                    companyInfoSegment?: {
                        businessID?: string;
                        taxID?: string;
                        vatID?: string;
                        companyName?: string;
                    };
                    pricelistSegment?: {
                        pricelists: {
                            id: number;
                            original: string;
                        }[];
                    };
                    createdAt?: string; // date-time
                    updatedAt?: string; // date-time
                    deletedAt?: string; // date-time
                };
                messages: {
                    message: string;
                    type: "ERROR" | "WARNING" | "SUCCESS" | "INFO";
                }[];
            }
        }
    }
    namespace PostApiB2BV1Services {
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
             * Služba 1
             */
            name: string;
            /**
             * example:
             * some text
             */
            description?: string | null;
            /**
             * example:
             * 10
             */
            durationFrom: number;
            /**
             * example:
             * 10
             */
            durationTo?: null | number;
            priceFrom: {
                /**
                 * example:
                 * -1
                 */
                exponent: number;
                /**
                 * example:
                 * 23
                 */
                significand: number;
            };
            priceTo?: {
                /**
                 * example:
                 * -1
                 */
                exponent: number;
                /**
                 * example:
                 * 23
                 */
                significand: number;
            } | null;
            /**
             * example:
             * 1
             */
            salonID: number;
            /**
             * example:
             * 1
             */
            categoryID: number;
            employeeIDs?: number[] | null;
            imageIDs?: number[] | null;
        }
        namespace Responses {
            export interface $200 {
                service: {
                    id: number;
                    name: string;
                    description?: string;
                    durationFrom: number;
                    durationTo?: number;
                    priceFrom: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    priceTo?: {
                        /**
                         * example:
                         * EUR
                         */
                        currency: string;
                        /**
                         * example:
                         * -1
                         */
                        exponent: number;
                        /**
                         * example:
                         * 23
                         */
                        significand: number;
                    };
                    employees: {
                        id: number;
                        fullName: string;
                        image: {
                            id: number;
                            original: string;
                            resizedImages: {
                                [key: string]: any;
                            };
                        };
                        employeeData?: {
                            durationFrom?: number;
                            durationTo?: number;
                            priceFrom?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                            priceTo?: {
                                /**
                                 * example:
                                 * EUR
                                 */
                                currency: string;
                                /**
                                 * example:
                                 * -1
                                 */
                                exponent: number;
                                /**
                                 * example:
                                 * 23
                                 */
                                significand: number;
                            };
                        };
                    }[];
                    category: {
                        id: number;
                        name?: string;
                        child: {
                            id: number;
                            name?: string;
                            child?: {
                                id: number;
                                name?: string;
                            };
                        };
                    };
                    images: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    }[];
                    salon: {
                        id: number;
                        name?: string;
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
                user: {
                    id: number;
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
                };
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
    namespace PostApiB2BV1UsersInvite {
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
            /**
             * example:
             * 1
             */
            imageID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                refreshToken: string;
                user: {
                    id: number;
                    email?: string;
                    lastAccess?: string; // date-time
                    activateAt?: string; // date-time
                    firstName?: string;
                    lastName?: string;
                    phonePrefixCountryCode?: string;
                    phone?: string; // ^\d+$
                    hasBasicInfo: boolean;
                    roles: {
                        id: number;
                        name?: string;
                        permissions: {
                            id: number;
                            name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                        }[];
                    }[];
                    salons: {
                        id: number;
                        employeeID: number;
                        role?: {
                            id: number;
                            permissions: {
                                id: number;
                                name: "NOTINO_SUPER_ADMIN" | "NOTINO_ADMIN" | "PARTNER" | "USER_BROWSING" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "ENUM_EDIT" | "LOGIN_AS_PARTNER" | "USER_ROLE_EDIT" | "PARTNER_ADMIN" | "SALON_UPDATE" | "SALON_DELETE" | "SALON_BILLING_UPDATE" | "SERVICE_CREATE" | "SERVICE_UPDATE" | "SERVICE_DELETE" | "EMPLOYEE_CREATE" | "EMPLOYEE_UPDATE" | "EMPLOYEE_DELETE" | "CUSTOMER_CREATE" | "CUSTOMER_UPDATE" | "CUSTOMER_DELETE";
                            }[];
                        };
                    }[];
                    disabledNotificationTypes?: ("TEST")[];
                    image?: {
                        id: number;
                        original: string;
                        resizedImages: {
                            [key: string]: any;
                        };
                    };
                    createdAt: string; // date-time
                    updatedAt: string; // date-time
                    deletedAt?: string; // date-time
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
   * patchApiB2BAdminAuthChangePassword - PERMISSION: NO
   */
  'patchApiB2BAdminAuthChangePassword'(
    parameters?: Parameters<Paths.PatchApiB2BAdminAuthChangePassword.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminAuthChangePassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminAuthChangePassword.Responses.$200>
  /**
   * getApiB2BAdminUsersUserId - PERMISSION: NO
   */
  'getApiB2BAdminUsersUserId'(
    parameters?: Parameters<Paths.GetApiB2BAdminUsersUserId.PathParameters & Paths.GetApiB2BAdminUsersUserId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminUsersUserId.Responses.$200>
  /**
   * patchApiB2BAdminUsersUserId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_EDIT]
   */
  'patchApiB2BAdminUsersUserId'(
    parameters?: Parameters<Paths.PatchApiB2BAdminUsersUserId.PathParameters & Paths.PatchApiB2BAdminUsersUserId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminUsersUserId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminUsersUserId.Responses.$200>
  /**
   * deleteApiB2BAdminUsersUserId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_DELETE]
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
   * getApiB2BAdminEnumsCategories - PERMISSION: NO
   */
  'getApiB2BAdminEnumsCategories'(
    parameters?: Parameters<Paths.GetApiB2BAdminEnumsCategories.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminEnumsCategories.Responses.$200>
  /**
   * postApiB2BAdminEnumsCategories - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, ENUM_EDIT]
   */
  'postApiB2BAdminEnumsCategories'(
    parameters?: Parameters<Paths.PostApiB2BAdminEnumsCategories.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminEnumsCategories.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminEnumsCategories.Responses.$200>
  /**
   * getApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: NO
   */
  'getApiB2BAdminEnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.GetApiB2BAdminEnumsCategoriesCategoryId.PathParameters & Paths.GetApiB2BAdminEnumsCategoriesCategoryId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
  /**
   * patchApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, ENUM_EDIT]
   */
  'patchApiB2BAdminEnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.PathParameters & Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
  /**
   * deleteApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, ENUM_EDIT]
   */
  'deleteApiB2BAdminEnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.PathParameters & Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.QueryParameters & Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
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
   * postApiB2BAdminFilesSignUrls - PERMISSION: NO
   */
  'postApiB2BAdminFilesSignUrls'(
    parameters?: Parameters<Paths.PostApiB2BAdminFilesSignUrls.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminFilesSignUrls.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminFilesSignUrls.Responses.$200>
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
   * patchApiB2BV1AuthChangePassword - PERMISSION: NO
   */
  'patchApiB2BV1AuthChangePassword'(
    parameters?: Parameters<Paths.PatchApiB2BV1AuthChangePassword.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1AuthChangePassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1AuthChangePassword.Responses.$200>
  /**
   * getApiB2BV1UsersUserId - PERMISSION: NO
   */
  'getApiB2BV1UsersUserId'(
    parameters?: Parameters<Paths.GetApiB2BV1UsersUserId.PathParameters & Paths.GetApiB2BV1UsersUserId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1UsersUserId.Responses.$200>
  /**
   * patchApiB2BV1UsersUserId - PERMISSION: NO
   */
  'patchApiB2BV1UsersUserId'(
    parameters?: Parameters<Paths.PatchApiB2BV1UsersUserId.PathParameters & Paths.PatchApiB2BV1UsersUserId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1UsersUserId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1UsersUserId.Responses.$200>
  /**
   * deleteApiB2BV1UsersUserId - PERMISSION: NO
   */
  'deleteApiB2BV1UsersUserId'(
    parameters?: Parameters<Paths.DeleteApiB2BV1UsersUserId.PathParameters & Paths.DeleteApiB2BV1UsersUserId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BV1UsersUserId.Responses.$200>
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
   * getApiB2BV1EnumsCategories - PERMISSION: NO
   */
  'getApiB2BV1EnumsCategories'(
    parameters?: Parameters<Paths.GetApiB2BV1EnumsCategories.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1EnumsCategories.Responses.$200>
  /**
   * getApiB2BV1EnumsCategoriesCategoryId - PERMISSION: NO
   */
  'getApiB2BV1EnumsCategoriesCategoryId'(
    parameters?: Parameters<Paths.GetApiB2BV1EnumsCategoriesCategoryId.PathParameters & Paths.GetApiB2BV1EnumsCategoriesCategoryId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1EnumsCategoriesCategoryId.Responses.$200>
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
   * postApiB2BV1FilesSignUrls - PERMISSION: NO
   */
  'postApiB2BV1FilesSignUrls'(
    parameters?: Parameters<Paths.PostApiB2BV1FilesSignUrls.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1FilesSignUrls.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1FilesSignUrls.Responses.$200>
  /**
   * postApiB2BV1PushNotificationsSubscribe - PERMISSION: NO
   */
  'postApiB2BV1PushNotificationsSubscribe'(
    parameters?: Parameters<Paths.PostApiB2BV1PushNotificationsSubscribe.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1PushNotificationsSubscribe.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1PushNotificationsSubscribe.Responses.$200>
  /**
   * deleteApiB2BV1PushNotificationsUnsubscribeDeviceId - PERMISSION: NO
   */
  'deleteApiB2BV1PushNotificationsUnsubscribeDeviceId'(
    parameters?: Parameters<Paths.DeleteApiB2BV1PushNotificationsUnsubscribeDeviceId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BV1PushNotificationsUnsubscribeDeviceId.Responses.$200>
  /**
   * getApiB2CV1Salons - PERMISSION: NO
   */
  'getApiB2CV1Salons'(
    parameters?: Parameters<Paths.GetApiB2CV1Salons.QueryParameters & Paths.GetApiB2CV1Salons.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2CV1Salons.Responses.$200>
  /**
   * getApiB2CV1SalonsMap - PERMISSION: NO
   */
  'getApiB2CV1SalonsMap'(
    parameters?: Parameters<Paths.GetApiB2CV1SalonsMap.QueryParameters & Paths.GetApiB2CV1SalonsMap.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2CV1SalonsMap.Responses.$200>
  /**
   * getApiB2CV1SalonsFilter - PERMISSION: NO
   */
  'getApiB2CV1SalonsFilter'(
    parameters?: Parameters<Paths.GetApiB2CV1SalonsFilter.QueryParameters & Paths.GetApiB2CV1SalonsFilter.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2CV1SalonsFilter.Responses.$200>
  /**
   * getApiB2CV1SalonsFilterCitiesPlaceId - PERMISSION: NO
   */
  'getApiB2CV1SalonsFilterCitiesPlaceId'(
    parameters?: Parameters<Paths.GetApiB2CV1SalonsFilterCitiesPlaceId.PathParameters & Paths.GetApiB2CV1SalonsFilterCitiesPlaceId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2CV1SalonsFilterCitiesPlaceId.Responses.$200>
  /**
   * getApiB2CV1SalonsSalonId - PERMISSION: NO
   */
  'getApiB2CV1SalonsSalonId'(
    parameters?: Parameters<Paths.GetApiB2CV1SalonsSalonId.PathParameters & Paths.GetApiB2CV1SalonsSalonId.QueryParameters & Paths.GetApiB2CV1SalonsSalonId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2CV1SalonsSalonId.Responses.$200>
  /**
   * getApiB2CV1SalonsSalonIdServices - PERMISSION: NO
   */
  'getApiB2CV1SalonsSalonIdServices'(
    parameters?: Parameters<Paths.GetApiB2CV1SalonsSalonIdServices.PathParameters & Paths.GetApiB2CV1SalonsSalonIdServices.QueryParameters & Paths.GetApiB2CV1SalonsSalonIdServices.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2CV1SalonsSalonIdServices.Responses.$200>
  /**
   * getApiB2CV1SalonsSalonIdEmployees - PERMISSION: NO
   */
  'getApiB2CV1SalonsSalonIdEmployees'(
    parameters?: Parameters<Paths.GetApiB2CV1SalonsSalonIdEmployees.PathParameters & Paths.GetApiB2CV1SalonsSalonIdEmployees.QueryParameters & Paths.GetApiB2CV1SalonsSalonIdEmployees.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2CV1SalonsSalonIdEmployees.Responses.$200>
  /**
   * patchApiB2CV1SalonsSalonIdLike - PERMISSION: NO
   */
  'patchApiB2CV1SalonsSalonIdLike'(
    parameters?: Parameters<Paths.PatchApiB2CV1SalonsSalonIdLike.PathParameters & Paths.PatchApiB2CV1SalonsSalonIdLike.HeaderParameters> | null,
    data?: Paths.PatchApiB2CV1SalonsSalonIdLike.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2CV1SalonsSalonIdLike.Responses.$200>
  /**
   * getApiB2CV1EnumsCategories - PERMISSION: NO
   */
  'getApiB2CV1EnumsCategories'(
    parameters?: Parameters<Paths.GetApiB2CV1EnumsCategories.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2CV1EnumsCategories.Responses.$200>
  /**
   * postApiB2BAdminAuthLogin - PERMISSION: NO
   */
  'postApiB2BAdminAuthLogin'(
    parameters?: Parameters<Paths.PostApiB2BAdminAuthLogin.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminAuthLogin.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthLogin.Responses.$200>
  /**
   * getApiB2BAdminUsers - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_BROWSING]
   */
  'getApiB2BAdminUsers'(
    parameters?: Parameters<Paths.GetApiB2BAdminUsers.QueryParameters & Paths.GetApiB2BAdminUsers.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminUsers.Responses.$200>
  /**
   * postApiB2BAdminUsers - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_CREATE]
   */
  'postApiB2BAdminUsers'(
    parameters?: Parameters<Paths.PostApiB2BAdminUsers.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminUsers.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminUsers.Responses.$200>
  /**
   * getApiB2BAdminRolesSystemUser - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_CREATE]
   */
  'getApiB2BAdminRolesSystemUser'(
    parameters?: Parameters<Paths.GetApiB2BAdminRolesSystemUser.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminRolesSystemUser.Responses.$200>
  /**
   * getApiB2BAdminRolesSalon - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BAdminRolesSalon'(
    parameters?: Parameters<Paths.GetApiB2BAdminRolesSalon.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminRolesSalon.Responses.$200>
  /**
   * getApiB2BAdminSalons - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BAdminSalons'(
    parameters?: Parameters<Paths.GetApiB2BAdminSalons.QueryParameters & Paths.GetApiB2BAdminSalons.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminSalons.Responses.$200>
  /**
   * postApiB2BAdminSalons - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'postApiB2BAdminSalons'(
    parameters?: Parameters<Paths.PostApiB2BAdminSalons.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminSalons.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminSalons.Responses.$200>
  /**
   * getApiB2BAdminSalonsSalonId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BAdminSalonsSalonId'(
    parameters?: Parameters<Paths.GetApiB2BAdminSalonsSalonId.PathParameters & Paths.GetApiB2BAdminSalonsSalonId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminSalonsSalonId.Responses.$200>
  /**
   * patchApiB2BAdminSalonsSalonId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_UPDATE]
   */
  'patchApiB2BAdminSalonsSalonId'(
    parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonId.PathParameters & Paths.PatchApiB2BAdminSalonsSalonId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminSalonsSalonId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonId.Responses.$200>
  /**
   * deleteApiB2BAdminSalonsSalonId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_DELETE]
   */
  'deleteApiB2BAdminSalonsSalonId'(
    parameters?: Parameters<Paths.DeleteApiB2BAdminSalonsSalonId.PathParameters & Paths.DeleteApiB2BAdminSalonsSalonId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BAdminSalonsSalonId.Responses.$200>
  /**
   * patchApiB2BAdminSalonsSalonIdOpenHoursNote - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_UPDATE]
   */
  'patchApiB2BAdminSalonsSalonIdOpenHoursNote'(
    parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonIdOpenHoursNote.PathParameters & Paths.PatchApiB2BAdminSalonsSalonIdOpenHoursNote.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminSalonsSalonIdOpenHoursNote.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonIdOpenHoursNote.Responses.$200>
  /**
   * patchApiB2BAdminSalonsSalonIdInvoice - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_BILLING_UPDATE]
   */
  'patchApiB2BAdminSalonsSalonIdInvoice'(
    parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonIdInvoice.PathParameters & Paths.PatchApiB2BAdminSalonsSalonIdInvoice.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminSalonsSalonIdInvoice.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonIdInvoice.Responses.$200>
  /**
   * patchApiB2BAdminSalonsSalonIdPublish - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_UPDATE]
   */
  'patchApiB2BAdminSalonsSalonIdPublish'(
    parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonIdPublish.PathParameters & Paths.PatchApiB2BAdminSalonsSalonIdPublish.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminSalonsSalonIdPublish.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonIdPublish.Responses.$200>
  /**
   * patchApiB2BAdminSalonsSalonIdVisible - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN]
   */
  'patchApiB2BAdminSalonsSalonIdVisible'(
    parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonIdVisible.PathParameters & Paths.PatchApiB2BAdminSalonsSalonIdVisible.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminSalonsSalonIdVisible.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonIdVisible.Responses.$200>
  /**
   * getApiB2BAdminServices - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BAdminServices'(
    parameters?: Parameters<Paths.GetApiB2BAdminServices.QueryParameters & Paths.GetApiB2BAdminServices.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminServices.Responses.$200>
  /**
   * postApiB2BAdminServices - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SERVICE_CREATE]
   */
  'postApiB2BAdminServices'(
    parameters?: Parameters<Paths.PostApiB2BAdminServices.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminServices.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminServices.Responses.$200>
  /**
   * getApiB2BAdminServicesServiceId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BAdminServicesServiceId'(
    parameters?: Parameters<Paths.GetApiB2BAdminServicesServiceId.PathParameters & Paths.GetApiB2BAdminServicesServiceId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminServicesServiceId.Responses.$200>
  /**
   * patchApiB2BAdminServicesServiceId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SERVICE_UPDATE]
   */
  'patchApiB2BAdminServicesServiceId'(
    parameters?: Parameters<Paths.PatchApiB2BAdminServicesServiceId.PathParameters & Paths.PatchApiB2BAdminServicesServiceId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminServicesServiceId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminServicesServiceId.Responses.$200>
  /**
   * deleteApiB2BAdminServicesServiceId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SERVICE_DELETE]
   */
  'deleteApiB2BAdminServicesServiceId'(
    parameters?: Parameters<Paths.DeleteApiB2BAdminServicesServiceId.PathParameters & Paths.DeleteApiB2BAdminServicesServiceId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BAdminServicesServiceId.Responses.$200>
  /**
   * getApiB2BAdminCustomers - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BAdminCustomers'(
    parameters?: Parameters<Paths.GetApiB2BAdminCustomers.QueryParameters & Paths.GetApiB2BAdminCustomers.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminCustomers.Responses.$200>
  /**
   * postApiB2BAdminCustomers - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, CUSTOMER_CREATE]
   */
  'postApiB2BAdminCustomers'(
    parameters?: Parameters<Paths.PostApiB2BAdminCustomers.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminCustomers.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminCustomers.Responses.$200>
  /**
   * getApiB2BAdminCustomersCustomerId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BAdminCustomersCustomerId'(
    parameters?: Parameters<Paths.GetApiB2BAdminCustomersCustomerId.PathParameters & Paths.GetApiB2BAdminCustomersCustomerId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminCustomersCustomerId.Responses.$200>
  /**
   * patchApiB2BAdminCustomersCustomerId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, CUSTOMER_UPDATE]
   */
  'patchApiB2BAdminCustomersCustomerId'(
    parameters?: Parameters<Paths.PatchApiB2BAdminCustomersCustomerId.PathParameters & Paths.PatchApiB2BAdminCustomersCustomerId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminCustomersCustomerId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminCustomersCustomerId.Responses.$200>
  /**
   * deleteApiB2BAdminCustomersCustomerId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, CUSTOMER_DELETE]
   */
  'deleteApiB2BAdminCustomersCustomerId'(
    parameters?: Parameters<Paths.DeleteApiB2BAdminCustomersCustomerId.PathParameters & Paths.DeleteApiB2BAdminCustomersCustomerId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BAdminCustomersCustomerId.Responses.$200>
  /**
   * getApiB2BAdminEmployees - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BAdminEmployees'(
    parameters?: Parameters<Paths.GetApiB2BAdminEmployees.QueryParameters & Paths.GetApiB2BAdminEmployees.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminEmployees.Responses.$200>
  /**
   * postApiB2BAdminEmployees - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_CREATE]
   */
  'postApiB2BAdminEmployees'(
    parameters?: Parameters<Paths.PostApiB2BAdminEmployees.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminEmployees.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminEmployees.Responses.$200>
  /**
   * getApiB2BAdminEmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BAdminEmployeesEmployeeId'(
    parameters?: Parameters<Paths.GetApiB2BAdminEmployeesEmployeeId.PathParameters & Paths.GetApiB2BAdminEmployeesEmployeeId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminEmployeesEmployeeId.Responses.$200>
  /**
   * patchApiB2BAdminEmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_UPDATE]
   */
  'patchApiB2BAdminEmployeesEmployeeId'(
    parameters?: Parameters<Paths.PatchApiB2BAdminEmployeesEmployeeId.PathParameters & Paths.PatchApiB2BAdminEmployeesEmployeeId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminEmployeesEmployeeId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminEmployeesEmployeeId.Responses.$200>
  /**
   * deleteApiB2BAdminEmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_DELETE]
   */
  'deleteApiB2BAdminEmployeesEmployeeId'(
    parameters?: Parameters<Paths.DeleteApiB2BAdminEmployeesEmployeeId.PathParameters & Paths.DeleteApiB2BAdminEmployeesEmployeeId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BAdminEmployeesEmployeeId.Responses.$200>
  /**
   * postApiB2BAdminEmployeesInvite - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_CREATE]
   */
  'postApiB2BAdminEmployeesInvite'(
    parameters?: Parameters<Paths.PostApiB2BAdminEmployeesInvite.HeaderParameters> | null,
    data?: Paths.PostApiB2BAdminEmployeesInvite.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminEmployeesInvite.Responses.$200>
  /**
   * patchApiB2BAdminEmployeesEmployeeIdRole - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, USER_ROLE_EDIT]
   */
  'patchApiB2BAdminEmployeesEmployeeIdRole'(
    parameters?: Parameters<Paths.PatchApiB2BAdminEmployeesEmployeeIdRole.PathParameters & Paths.PatchApiB2BAdminEmployeesEmployeeIdRole.HeaderParameters> | null,
    data?: Paths.PatchApiB2BAdminEmployeesEmployeeIdRole.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BAdminEmployeesEmployeeIdRole.Responses.$200>
  /**
   * postApiB2BV1AuthLoginAsPartner - PERMISSION: [NOTINO_ADMIN, LOGIN_AS_PARTNER]
   */
  'postApiB2BV1AuthLoginAsPartner'(
    parameters?: Parameters<Paths.PostApiB2BV1AuthLoginAsPartner.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1AuthLoginAsPartner.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthLoginAsPartner.Responses.$200>
  /**
   * getApiB2BV1UsersPartners - PERMISSION: [NOTINO_ADMIN, LOGIN_AS_PARTNER]
   */
  'getApiB2BV1UsersPartners'(
    parameters?: Parameters<Paths.GetApiB2BV1UsersPartners.QueryParameters & Paths.GetApiB2BV1UsersPartners.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1UsersPartners.Responses.$200>
  /**
   * getApiB2BV1UsersUserIdPendingEmployeeInvites - PERMISSION: NO
   */
  'getApiB2BV1UsersUserIdPendingEmployeeInvites'(
    parameters?: Parameters<Paths.GetApiB2BV1UsersUserIdPendingEmployeeInvites.PathParameters & Paths.GetApiB2BV1UsersUserIdPendingEmployeeInvites.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1UsersUserIdPendingEmployeeInvites.Responses.$200>
  /**
   * postApiB2BV1UsersInvite - PERMISSION: [PARTNER]
   */
  'postApiB2BV1UsersInvite'(
    parameters?: Parameters<Paths.PostApiB2BV1UsersInvite.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1UsersInvite.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1UsersInvite.Responses.$200>
  /**
   * getApiB2BV1Salons - PERMISSION: [PARTNER]
   */
  'getApiB2BV1Salons'(
    parameters?: Parameters<Paths.GetApiB2BV1Salons.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1Salons.Responses.$200>
  /**
   * postApiB2BV1Salons - PERMISSION: [PARTNER]
   */
  'postApiB2BV1Salons'(
    parameters?: Parameters<Paths.PostApiB2BV1Salons.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1Salons.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1Salons.Responses.$200>
  /**
   * getApiB2BV1SalonsPreview - PERMISSION: [PARTNER]
   */
  'getApiB2BV1SalonsPreview'(
    parameters?: Parameters<Paths.GetApiB2BV1SalonsPreview.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1SalonsPreview.Responses.$200>
  /**
   * getApiB2BV1SalonsSalonId - PERMISSION: [PARTNER]
   */
  'getApiB2BV1SalonsSalonId'(
    parameters?: Parameters<Paths.GetApiB2BV1SalonsSalonId.PathParameters & Paths.GetApiB2BV1SalonsSalonId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1SalonsSalonId.Responses.$200>
  /**
   * patchApiB2BV1SalonsSalonId - PERMISSION: [PARTNER, PARTNER_ADMIN, SALON_UPDATE]
   */
  'patchApiB2BV1SalonsSalonId'(
    parameters?: Parameters<Paths.PatchApiB2BV1SalonsSalonId.PathParameters & Paths.PatchApiB2BV1SalonsSalonId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1SalonsSalonId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1SalonsSalonId.Responses.$200>
  /**
   * deleteApiB2BV1SalonsSalonId - PERMISSION: [PARTNER, PARTNER_ADMIN, SALON_DELETE]
   */
  'deleteApiB2BV1SalonsSalonId'(
    parameters?: Parameters<Paths.DeleteApiB2BV1SalonsSalonId.PathParameters & Paths.DeleteApiB2BV1SalonsSalonId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BV1SalonsSalonId.Responses.$200>
  /**
   * getApiB2BV1SalonsSalonIdDashboard - PERMISSION: [PARTNER]
   */
  'getApiB2BV1SalonsSalonIdDashboard'(
    parameters?: Parameters<Paths.GetApiB2BV1SalonsSalonIdDashboard.PathParameters & Paths.GetApiB2BV1SalonsSalonIdDashboard.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1SalonsSalonIdDashboard.Responses.$200>
  /**
   * patchApiB2BV1SalonsSalonIdInvoice - PERMISSION: [PARTNER, PARTNER_ADMIN, SALON_BILLING_UPDATE]
   */
  'patchApiB2BV1SalonsSalonIdInvoice'(
    parameters?: Parameters<Paths.PatchApiB2BV1SalonsSalonIdInvoice.PathParameters & Paths.PatchApiB2BV1SalonsSalonIdInvoice.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1SalonsSalonIdInvoice.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1SalonsSalonIdInvoice.Responses.$200>
  /**
   * patchApiB2BV1SalonsSalonIdPublish - PERMISSION: [PARTNER, PARTNER_ADMIN, SALON_UPDATE]
   */
  'patchApiB2BV1SalonsSalonIdPublish'(
    parameters?: Parameters<Paths.PatchApiB2BV1SalonsSalonIdPublish.PathParameters & Paths.PatchApiB2BV1SalonsSalonIdPublish.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1SalonsSalonIdPublish.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1SalonsSalonIdPublish.Responses.$200>
  /**
   * patchApiB2BV1SalonsSalonIdAcceptEmployeeInvite - PERMISSION: [PARTNER]
   */
  'patchApiB2BV1SalonsSalonIdAcceptEmployeeInvite'(
    parameters?: Parameters<Paths.PatchApiB2BV1SalonsSalonIdAcceptEmployeeInvite.PathParameters & Paths.PatchApiB2BV1SalonsSalonIdAcceptEmployeeInvite.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1SalonsSalonIdAcceptEmployeeInvite.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1SalonsSalonIdAcceptEmployeeInvite.Responses.$200>
  /**
   * getApiB2BV1Services - PERMISSION: [PARTNER]
   */
  'getApiB2BV1Services'(
    parameters?: Parameters<Paths.GetApiB2BV1Services.QueryParameters & Paths.GetApiB2BV1Services.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1Services.Responses.$200>
  /**
   * postApiB2BV1Services - PERMISSION: [PARTNER, PARTNER_ADMIN, SERVICE_CREATE]
   */
  'postApiB2BV1Services'(
    parameters?: Parameters<Paths.PostApiB2BV1Services.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1Services.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1Services.Responses.$200>
  /**
   * getApiB2BV1ServicesServiceId - PERMISSION: [PARTNER]
   */
  'getApiB2BV1ServicesServiceId'(
    parameters?: Parameters<Paths.GetApiB2BV1ServicesServiceId.PathParameters & Paths.GetApiB2BV1ServicesServiceId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1ServicesServiceId.Responses.$200>
  /**
   * patchApiB2BV1ServicesServiceId - PERMISSION: [PARTNER, PARTNER_ADMIN, SERVICE_UPDATE]
   */
  'patchApiB2BV1ServicesServiceId'(
    parameters?: Parameters<Paths.PatchApiB2BV1ServicesServiceId.PathParameters & Paths.PatchApiB2BV1ServicesServiceId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1ServicesServiceId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1ServicesServiceId.Responses.$200>
  /**
   * deleteApiB2BV1ServicesServiceId - PERMISSION: [PARTNER, PARTNER_ADMIN, SERVICE_DELETE]
   */
  'deleteApiB2BV1ServicesServiceId'(
    parameters?: Parameters<Paths.DeleteApiB2BV1ServicesServiceId.PathParameters & Paths.DeleteApiB2BV1ServicesServiceId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BV1ServicesServiceId.Responses.$200>
  /**
   * getApiB2BV1Customers - PERMISSION: [PARTNER]
   */
  'getApiB2BV1Customers'(
    parameters?: Parameters<Paths.GetApiB2BV1Customers.QueryParameters & Paths.GetApiB2BV1Customers.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1Customers.Responses.$200>
  /**
   * postApiB2BV1Customers - PERMISSION: [PARTNER, PARTNER_ADMIN, CUSTOMER_CREATE]
   */
  'postApiB2BV1Customers'(
    parameters?: Parameters<Paths.PostApiB2BV1Customers.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1Customers.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1Customers.Responses.$200>
  /**
   * getApiB2BV1CustomersCustomerId - PERMISSION: [PARTNER]
   */
  'getApiB2BV1CustomersCustomerId'(
    parameters?: Parameters<Paths.GetApiB2BV1CustomersCustomerId.PathParameters & Paths.GetApiB2BV1CustomersCustomerId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1CustomersCustomerId.Responses.$200>
  /**
   * patchApiB2BV1CustomersCustomerId - PERMISSION: [PARTNER, PARTNER_ADMIN, CUSTOMER_UPDATE]
   */
  'patchApiB2BV1CustomersCustomerId'(
    parameters?: Parameters<Paths.PatchApiB2BV1CustomersCustomerId.PathParameters & Paths.PatchApiB2BV1CustomersCustomerId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1CustomersCustomerId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1CustomersCustomerId.Responses.$200>
  /**
   * deleteApiB2BV1CustomersCustomerId - PERMISSION: [PARTNER, PARTNER_ADMIN, CUSTOMER_DELETE]
   */
  'deleteApiB2BV1CustomersCustomerId'(
    parameters?: Parameters<Paths.DeleteApiB2BV1CustomersCustomerId.PathParameters & Paths.DeleteApiB2BV1CustomersCustomerId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BV1CustomersCustomerId.Responses.$200>
  /**
   * getApiB2BV1Employees - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BV1Employees'(
    parameters?: Parameters<Paths.GetApiB2BV1Employees.QueryParameters & Paths.GetApiB2BV1Employees.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1Employees.Responses.$200>
  /**
   * postApiB2BV1Employees - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_CREATE]
   */
  'postApiB2BV1Employees'(
    parameters?: Parameters<Paths.PostApiB2BV1Employees.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1Employees.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1Employees.Responses.$200>
  /**
   * getApiB2BV1EmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
   */
  'getApiB2BV1EmployeesEmployeeId'(
    parameters?: Parameters<Paths.GetApiB2BV1EmployeesEmployeeId.PathParameters & Paths.GetApiB2BV1EmployeesEmployeeId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1EmployeesEmployeeId.Responses.$200>
  /**
   * patchApiB2BV1EmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_UPDATE]
   */
  'patchApiB2BV1EmployeesEmployeeId'(
    parameters?: Parameters<Paths.PatchApiB2BV1EmployeesEmployeeId.PathParameters & Paths.PatchApiB2BV1EmployeesEmployeeId.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1EmployeesEmployeeId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1EmployeesEmployeeId.Responses.$200>
  /**
   * deleteApiB2BV1EmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_DELETE]
   */
  'deleteApiB2BV1EmployeesEmployeeId'(
    parameters?: Parameters<Paths.DeleteApiB2BV1EmployeesEmployeeId.PathParameters & Paths.DeleteApiB2BV1EmployeesEmployeeId.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiB2BV1EmployeesEmployeeId.Responses.$200>
  /**
   * postApiB2BV1EmployeesInvite - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_CREATE]
   */
  'postApiB2BV1EmployeesInvite'(
    parameters?: Parameters<Paths.PostApiB2BV1EmployeesInvite.HeaderParameters> | null,
    data?: Paths.PostApiB2BV1EmployeesInvite.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1EmployeesInvite.Responses.$200>
  /**
   * patchApiB2BV1EmployeesEmployeeIdRole - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, USER_ROLE_EDIT]
   */
  'patchApiB2BV1EmployeesEmployeeIdRole'(
    parameters?: Parameters<Paths.PatchApiB2BV1EmployeesEmployeeIdRole.PathParameters & Paths.PatchApiB2BV1EmployeesEmployeeIdRole.HeaderParameters> | null,
    data?: Paths.PatchApiB2BV1EmployeesEmployeeIdRole.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1EmployeesEmployeeIdRole.Responses.$200>
  /**
   * getApiB2BV1RolesSalon - PERMISSION: [PARTNER]
   */
  'getApiB2BV1RolesSalon'(
    parameters?: Parameters<Paths.GetApiB2BV1RolesSalon.HeaderParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BV1RolesSalon.Responses.$200>
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
  ['/api/b2b/admin/auth/change-password']: {
    /**
     * patchApiB2BAdminAuthChangePassword - PERMISSION: NO
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminAuthChangePassword.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminAuthChangePassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminAuthChangePassword.Responses.$200>
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
     * patchApiB2BAdminUsersUserId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminUsersUserId.PathParameters & Paths.PatchApiB2BAdminUsersUserId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminUsersUserId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminUsersUserId.Responses.$200>
    /**
     * deleteApiB2BAdminUsersUserId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_DELETE]
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
  ['/api/b2b/admin/enums/categories/']: {
    /**
     * getApiB2BAdminEnumsCategories - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminEnumsCategories.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminEnumsCategories.Responses.$200>
    /**
     * postApiB2BAdminEnumsCategories - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, ENUM_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminEnumsCategories.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminEnumsCategories.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminEnumsCategories.Responses.$200>
  }
  ['/api/b2b/admin/enums/categories/{categoryID}']: {
    /**
     * getApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminEnumsCategoriesCategoryId.PathParameters & Paths.GetApiB2BAdminEnumsCategoriesCategoryId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
    /**
     * patchApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, ENUM_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.PathParameters & Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
    /**
     * deleteApiB2BAdminEnumsCategoriesCategoryId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, ENUM_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.PathParameters & Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.QueryParameters & Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BAdminEnumsCategoriesCategoryId.Responses.$200>
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
  ['/api/b2b/admin/files/sign-urls']: {
    /**
     * postApiB2BAdminFilesSignUrls - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminFilesSignUrls.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminFilesSignUrls.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminFilesSignUrls.Responses.$200>
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
  ['/api/b2b/v1/auth/change-password']: {
    /**
     * patchApiB2BV1AuthChangePassword - PERMISSION: NO
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1AuthChangePassword.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1AuthChangePassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1AuthChangePassword.Responses.$200>
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
     * patchApiB2BV1UsersUserId - PERMISSION: NO
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1UsersUserId.PathParameters & Paths.PatchApiB2BV1UsersUserId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1UsersUserId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1UsersUserId.Responses.$200>
    /**
     * deleteApiB2BV1UsersUserId - PERMISSION: NO
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BV1UsersUserId.PathParameters & Paths.DeleteApiB2BV1UsersUserId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BV1UsersUserId.Responses.$200>
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
  ['/api/b2b/v1/enums/categories/']: {
    /**
     * getApiB2BV1EnumsCategories - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1EnumsCategories.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1EnumsCategories.Responses.$200>
  }
  ['/api/b2b/v1/enums/categories/{categoryID}']: {
    /**
     * getApiB2BV1EnumsCategoriesCategoryId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1EnumsCategoriesCategoryId.PathParameters & Paths.GetApiB2BV1EnumsCategoriesCategoryId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1EnumsCategoriesCategoryId.Responses.$200>
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
  ['/api/b2b/v1/files/sign-urls']: {
    /**
     * postApiB2BV1FilesSignUrls - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1FilesSignUrls.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1FilesSignUrls.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1FilesSignUrls.Responses.$200>
  }
  ['/api/b2b/v1/push-notifications/subscribe']: {
    /**
     * postApiB2BV1PushNotificationsSubscribe - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1PushNotificationsSubscribe.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1PushNotificationsSubscribe.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1PushNotificationsSubscribe.Responses.$200>
  }
  ['/api/b2b/v1/push-notifications/unsubscribe/{deviceID}']: {
    /**
     * deleteApiB2BV1PushNotificationsUnsubscribeDeviceId - PERMISSION: NO
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BV1PushNotificationsUnsubscribeDeviceId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BV1PushNotificationsUnsubscribeDeviceId.Responses.$200>
  }
  ['/api/b2c/v1/salons/']: {
    /**
     * getApiB2CV1Salons - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2CV1Salons.QueryParameters & Paths.GetApiB2CV1Salons.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2CV1Salons.Responses.$200>
  }
  ['/api/b2c/v1/salons/map']: {
    /**
     * getApiB2CV1SalonsMap - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2CV1SalonsMap.QueryParameters & Paths.GetApiB2CV1SalonsMap.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2CV1SalonsMap.Responses.$200>
  }
  ['/api/b2c/v1/salons/filter']: {
    /**
     * getApiB2CV1SalonsFilter - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2CV1SalonsFilter.QueryParameters & Paths.GetApiB2CV1SalonsFilter.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2CV1SalonsFilter.Responses.$200>
  }
  ['/api/b2c/v1/salons/filter/cities/{placeID}']: {
    /**
     * getApiB2CV1SalonsFilterCitiesPlaceId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2CV1SalonsFilterCitiesPlaceId.PathParameters & Paths.GetApiB2CV1SalonsFilterCitiesPlaceId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2CV1SalonsFilterCitiesPlaceId.Responses.$200>
  }
  ['/api/b2c/v1/salons/{salonID}']: {
    /**
     * getApiB2CV1SalonsSalonId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2CV1SalonsSalonId.PathParameters & Paths.GetApiB2CV1SalonsSalonId.QueryParameters & Paths.GetApiB2CV1SalonsSalonId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2CV1SalonsSalonId.Responses.$200>
  }
  ['/api/b2c/v1/salons/{salonID}/services']: {
    /**
     * getApiB2CV1SalonsSalonIdServices - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2CV1SalonsSalonIdServices.PathParameters & Paths.GetApiB2CV1SalonsSalonIdServices.QueryParameters & Paths.GetApiB2CV1SalonsSalonIdServices.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2CV1SalonsSalonIdServices.Responses.$200>
  }
  ['/api/b2c/v1/salons/{salonID}/employees']: {
    /**
     * getApiB2CV1SalonsSalonIdEmployees - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2CV1SalonsSalonIdEmployees.PathParameters & Paths.GetApiB2CV1SalonsSalonIdEmployees.QueryParameters & Paths.GetApiB2CV1SalonsSalonIdEmployees.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2CV1SalonsSalonIdEmployees.Responses.$200>
  }
  ['/api/b2c/v1/salons/{salonID}/like']: {
    /**
     * patchApiB2CV1SalonsSalonIdLike - PERMISSION: NO
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2CV1SalonsSalonIdLike.PathParameters & Paths.PatchApiB2CV1SalonsSalonIdLike.HeaderParameters> | null,
      data?: Paths.PatchApiB2CV1SalonsSalonIdLike.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2CV1SalonsSalonIdLike.Responses.$200>
  }
  ['/api/b2c/v1/enums/categories/']: {
    /**
     * getApiB2CV1EnumsCategories - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2CV1EnumsCategories.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2CV1EnumsCategories.Responses.$200>
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
     * getApiB2BAdminUsers - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminUsers.QueryParameters & Paths.GetApiB2BAdminUsers.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminUsers.Responses.$200>
    /**
     * postApiB2BAdminUsers - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminUsers.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminUsers.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminUsers.Responses.$200>
  }
  ['/api/b2b/admin/roles/system-user']: {
    /**
     * getApiB2BAdminRolesSystemUser - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, USER_CREATE]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminRolesSystemUser.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminRolesSystemUser.Responses.$200>
  }
  ['/api/b2b/admin/roles/salon']: {
    /**
     * getApiB2BAdminRolesSalon - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminRolesSalon.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminRolesSalon.Responses.$200>
  }
  ['/api/b2b/admin/salons/']: {
    /**
     * getApiB2BAdminSalons - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminSalons.QueryParameters & Paths.GetApiB2BAdminSalons.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminSalons.Responses.$200>
    /**
     * postApiB2BAdminSalons - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminSalons.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminSalons.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminSalons.Responses.$200>
  }
  ['/api/b2b/admin/salons/{salonID}']: {
    /**
     * getApiB2BAdminSalonsSalonId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminSalonsSalonId.PathParameters & Paths.GetApiB2BAdminSalonsSalonId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminSalonsSalonId.Responses.$200>
    /**
     * patchApiB2BAdminSalonsSalonId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonId.PathParameters & Paths.PatchApiB2BAdminSalonsSalonId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminSalonsSalonId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonId.Responses.$200>
    /**
     * deleteApiB2BAdminSalonsSalonId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BAdminSalonsSalonId.PathParameters & Paths.DeleteApiB2BAdminSalonsSalonId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BAdminSalonsSalonId.Responses.$200>
  }
  ['/api/b2b/admin/salons/{salonID}/open-hours-note']: {
    /**
     * patchApiB2BAdminSalonsSalonIdOpenHoursNote - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonIdOpenHoursNote.PathParameters & Paths.PatchApiB2BAdminSalonsSalonIdOpenHoursNote.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminSalonsSalonIdOpenHoursNote.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonIdOpenHoursNote.Responses.$200>
  }
  ['/api/b2b/admin/salons/{salonID}/invoice']: {
    /**
     * patchApiB2BAdminSalonsSalonIdInvoice - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_BILLING_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonIdInvoice.PathParameters & Paths.PatchApiB2BAdminSalonsSalonIdInvoice.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminSalonsSalonIdInvoice.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonIdInvoice.Responses.$200>
  }
  ['/api/b2b/admin/salons/{salonID}/publish']: {
    /**
     * patchApiB2BAdminSalonsSalonIdPublish - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SALON_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonIdPublish.PathParameters & Paths.PatchApiB2BAdminSalonsSalonIdPublish.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminSalonsSalonIdPublish.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonIdPublish.Responses.$200>
  }
  ['/api/b2b/admin/salons/{salonID}/visible']: {
    /**
     * patchApiB2BAdminSalonsSalonIdVisible - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminSalonsSalonIdVisible.PathParameters & Paths.PatchApiB2BAdminSalonsSalonIdVisible.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminSalonsSalonIdVisible.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminSalonsSalonIdVisible.Responses.$200>
  }
  ['/api/b2b/admin/services/']: {
    /**
     * getApiB2BAdminServices - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminServices.QueryParameters & Paths.GetApiB2BAdminServices.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminServices.Responses.$200>
    /**
     * postApiB2BAdminServices - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SERVICE_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminServices.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminServices.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminServices.Responses.$200>
  }
  ['/api/b2b/admin/services/{serviceID}']: {
    /**
     * getApiB2BAdminServicesServiceId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminServicesServiceId.PathParameters & Paths.GetApiB2BAdminServicesServiceId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminServicesServiceId.Responses.$200>
    /**
     * patchApiB2BAdminServicesServiceId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SERVICE_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminServicesServiceId.PathParameters & Paths.PatchApiB2BAdminServicesServiceId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminServicesServiceId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminServicesServiceId.Responses.$200>
    /**
     * deleteApiB2BAdminServicesServiceId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, SERVICE_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BAdminServicesServiceId.PathParameters & Paths.DeleteApiB2BAdminServicesServiceId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BAdminServicesServiceId.Responses.$200>
  }
  ['/api/b2b/admin/customers/']: {
    /**
     * getApiB2BAdminCustomers - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminCustomers.QueryParameters & Paths.GetApiB2BAdminCustomers.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminCustomers.Responses.$200>
    /**
     * postApiB2BAdminCustomers - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, CUSTOMER_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminCustomers.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminCustomers.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminCustomers.Responses.$200>
  }
  ['/api/b2b/admin/customers/{customerID}']: {
    /**
     * getApiB2BAdminCustomersCustomerId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminCustomersCustomerId.PathParameters & Paths.GetApiB2BAdminCustomersCustomerId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminCustomersCustomerId.Responses.$200>
    /**
     * patchApiB2BAdminCustomersCustomerId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, CUSTOMER_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminCustomersCustomerId.PathParameters & Paths.PatchApiB2BAdminCustomersCustomerId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminCustomersCustomerId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminCustomersCustomerId.Responses.$200>
    /**
     * deleteApiB2BAdminCustomersCustomerId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, CUSTOMER_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BAdminCustomersCustomerId.PathParameters & Paths.DeleteApiB2BAdminCustomersCustomerId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BAdminCustomersCustomerId.Responses.$200>
  }
  ['/api/b2b/admin/employees/']: {
    /**
     * getApiB2BAdminEmployees - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminEmployees.QueryParameters & Paths.GetApiB2BAdminEmployees.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminEmployees.Responses.$200>
    /**
     * postApiB2BAdminEmployees - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminEmployees.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminEmployees.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminEmployees.Responses.$200>
  }
  ['/api/b2b/admin/employees/{employeeID}']: {
    /**
     * getApiB2BAdminEmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BAdminEmployeesEmployeeId.PathParameters & Paths.GetApiB2BAdminEmployeesEmployeeId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminEmployeesEmployeeId.Responses.$200>
    /**
     * patchApiB2BAdminEmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminEmployeesEmployeeId.PathParameters & Paths.PatchApiB2BAdminEmployeesEmployeeId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminEmployeesEmployeeId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminEmployeesEmployeeId.Responses.$200>
    /**
     * deleteApiB2BAdminEmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BAdminEmployeesEmployeeId.PathParameters & Paths.DeleteApiB2BAdminEmployeesEmployeeId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BAdminEmployeesEmployeeId.Responses.$200>
  }
  ['/api/b2b/admin/employees/invite']: {
    /**
     * postApiB2BAdminEmployeesInvite - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BAdminEmployeesInvite.HeaderParameters> | null,
      data?: Paths.PostApiB2BAdminEmployeesInvite.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminEmployeesInvite.Responses.$200>
  }
  ['/api/b2b/admin/employees/{employeeID}/role']: {
    /**
     * patchApiB2BAdminEmployeesEmployeeIdRole - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, USER_ROLE_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BAdminEmployeesEmployeeIdRole.PathParameters & Paths.PatchApiB2BAdminEmployeesEmployeeIdRole.HeaderParameters> | null,
      data?: Paths.PatchApiB2BAdminEmployeesEmployeeIdRole.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BAdminEmployeesEmployeeIdRole.Responses.$200>
  }
  ['/api/b2b/v1/auth/login-as-partner']: {
    /**
     * postApiB2BV1AuthLoginAsPartner - PERMISSION: [NOTINO_ADMIN, LOGIN_AS_PARTNER]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1AuthLoginAsPartner.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1AuthLoginAsPartner.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthLoginAsPartner.Responses.$200>
  }
  ['/api/b2b/v1/users/partners']: {
    /**
     * getApiB2BV1UsersPartners - PERMISSION: [NOTINO_ADMIN, LOGIN_AS_PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1UsersPartners.QueryParameters & Paths.GetApiB2BV1UsersPartners.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1UsersPartners.Responses.$200>
  }
  ['/api/b2b/v1/users/{userID}/pending-employee-invites']: {
    /**
     * getApiB2BV1UsersUserIdPendingEmployeeInvites - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1UsersUserIdPendingEmployeeInvites.PathParameters & Paths.GetApiB2BV1UsersUserIdPendingEmployeeInvites.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1UsersUserIdPendingEmployeeInvites.Responses.$200>
  }
  ['/api/b2b/v1/users/invite']: {
    /**
     * postApiB2BV1UsersInvite - PERMISSION: [PARTNER]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1UsersInvite.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1UsersInvite.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1UsersInvite.Responses.$200>
  }
  ['/api/b2b/v1/salons/']: {
    /**
     * getApiB2BV1Salons - PERMISSION: [PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1Salons.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1Salons.Responses.$200>
    /**
     * postApiB2BV1Salons - PERMISSION: [PARTNER]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1Salons.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1Salons.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1Salons.Responses.$200>
  }
  ['/api/b2b/v1/salons/preview']: {
    /**
     * getApiB2BV1SalonsPreview - PERMISSION: [PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1SalonsPreview.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1SalonsPreview.Responses.$200>
  }
  ['/api/b2b/v1/salons/{salonID}']: {
    /**
     * getApiB2BV1SalonsSalonId - PERMISSION: [PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1SalonsSalonId.PathParameters & Paths.GetApiB2BV1SalonsSalonId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1SalonsSalonId.Responses.$200>
    /**
     * patchApiB2BV1SalonsSalonId - PERMISSION: [PARTNER, PARTNER_ADMIN, SALON_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1SalonsSalonId.PathParameters & Paths.PatchApiB2BV1SalonsSalonId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1SalonsSalonId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1SalonsSalonId.Responses.$200>
    /**
     * deleteApiB2BV1SalonsSalonId - PERMISSION: [PARTNER, PARTNER_ADMIN, SALON_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BV1SalonsSalonId.PathParameters & Paths.DeleteApiB2BV1SalonsSalonId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BV1SalonsSalonId.Responses.$200>
  }
  ['/api/b2b/v1/salons/{salonID}/dashboard']: {
    /**
     * getApiB2BV1SalonsSalonIdDashboard - PERMISSION: [PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1SalonsSalonIdDashboard.PathParameters & Paths.GetApiB2BV1SalonsSalonIdDashboard.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1SalonsSalonIdDashboard.Responses.$200>
  }
  ['/api/b2b/v1/salons/{salonID}/invoice']: {
    /**
     * patchApiB2BV1SalonsSalonIdInvoice - PERMISSION: [PARTNER, PARTNER_ADMIN, SALON_BILLING_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1SalonsSalonIdInvoice.PathParameters & Paths.PatchApiB2BV1SalonsSalonIdInvoice.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1SalonsSalonIdInvoice.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1SalonsSalonIdInvoice.Responses.$200>
  }
  ['/api/b2b/v1/salons/{salonID}/publish']: {
    /**
     * patchApiB2BV1SalonsSalonIdPublish - PERMISSION: [PARTNER, PARTNER_ADMIN, SALON_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1SalonsSalonIdPublish.PathParameters & Paths.PatchApiB2BV1SalonsSalonIdPublish.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1SalonsSalonIdPublish.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1SalonsSalonIdPublish.Responses.$200>
  }
  ['/api/b2b/v1/salons/{salonID}/accept-employee-invite']: {
    /**
     * patchApiB2BV1SalonsSalonIdAcceptEmployeeInvite - PERMISSION: [PARTNER]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1SalonsSalonIdAcceptEmployeeInvite.PathParameters & Paths.PatchApiB2BV1SalonsSalonIdAcceptEmployeeInvite.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1SalonsSalonIdAcceptEmployeeInvite.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1SalonsSalonIdAcceptEmployeeInvite.Responses.$200>
  }
  ['/api/b2b/v1/services/']: {
    /**
     * getApiB2BV1Services - PERMISSION: [PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1Services.QueryParameters & Paths.GetApiB2BV1Services.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1Services.Responses.$200>
    /**
     * postApiB2BV1Services - PERMISSION: [PARTNER, PARTNER_ADMIN, SERVICE_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1Services.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1Services.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1Services.Responses.$200>
  }
  ['/api/b2b/v1/services/{serviceID}']: {
    /**
     * getApiB2BV1ServicesServiceId - PERMISSION: [PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1ServicesServiceId.PathParameters & Paths.GetApiB2BV1ServicesServiceId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1ServicesServiceId.Responses.$200>
    /**
     * patchApiB2BV1ServicesServiceId - PERMISSION: [PARTNER, PARTNER_ADMIN, SERVICE_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1ServicesServiceId.PathParameters & Paths.PatchApiB2BV1ServicesServiceId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1ServicesServiceId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1ServicesServiceId.Responses.$200>
    /**
     * deleteApiB2BV1ServicesServiceId - PERMISSION: [PARTNER, PARTNER_ADMIN, SERVICE_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BV1ServicesServiceId.PathParameters & Paths.DeleteApiB2BV1ServicesServiceId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BV1ServicesServiceId.Responses.$200>
  }
  ['/api/b2b/v1/customers/']: {
    /**
     * getApiB2BV1Customers - PERMISSION: [PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1Customers.QueryParameters & Paths.GetApiB2BV1Customers.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1Customers.Responses.$200>
    /**
     * postApiB2BV1Customers - PERMISSION: [PARTNER, PARTNER_ADMIN, CUSTOMER_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1Customers.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1Customers.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1Customers.Responses.$200>
  }
  ['/api/b2b/v1/customers/{customerID}']: {
    /**
     * getApiB2BV1CustomersCustomerId - PERMISSION: [PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1CustomersCustomerId.PathParameters & Paths.GetApiB2BV1CustomersCustomerId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1CustomersCustomerId.Responses.$200>
    /**
     * patchApiB2BV1CustomersCustomerId - PERMISSION: [PARTNER, PARTNER_ADMIN, CUSTOMER_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1CustomersCustomerId.PathParameters & Paths.PatchApiB2BV1CustomersCustomerId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1CustomersCustomerId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1CustomersCustomerId.Responses.$200>
    /**
     * deleteApiB2BV1CustomersCustomerId - PERMISSION: [PARTNER, PARTNER_ADMIN, CUSTOMER_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BV1CustomersCustomerId.PathParameters & Paths.DeleteApiB2BV1CustomersCustomerId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BV1CustomersCustomerId.Responses.$200>
  }
  ['/api/b2b/v1/employees/']: {
    /**
     * getApiB2BV1Employees - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1Employees.QueryParameters & Paths.GetApiB2BV1Employees.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1Employees.Responses.$200>
    /**
     * postApiB2BV1Employees - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1Employees.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1Employees.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1Employees.Responses.$200>
  }
  ['/api/b2b/v1/employees/{employeeID}']: {
    /**
     * getApiB2BV1EmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1EmployeesEmployeeId.PathParameters & Paths.GetApiB2BV1EmployeesEmployeeId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1EmployeesEmployeeId.Responses.$200>
    /**
     * patchApiB2BV1EmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_UPDATE]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1EmployeesEmployeeId.PathParameters & Paths.PatchApiB2BV1EmployeesEmployeeId.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1EmployeesEmployeeId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1EmployeesEmployeeId.Responses.$200>
    /**
     * deleteApiB2BV1EmployeesEmployeeId - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiB2BV1EmployeesEmployeeId.PathParameters & Paths.DeleteApiB2BV1EmployeesEmployeeId.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiB2BV1EmployeesEmployeeId.Responses.$200>
  }
  ['/api/b2b/v1/employees/invite']: {
    /**
     * postApiB2BV1EmployeesInvite - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, EMPLOYEE_CREATE]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiB2BV1EmployeesInvite.HeaderParameters> | null,
      data?: Paths.PostApiB2BV1EmployeesInvite.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1EmployeesInvite.Responses.$200>
  }
  ['/api/b2b/v1/employees/{employeeID}/role']: {
    /**
     * patchApiB2BV1EmployeesEmployeeIdRole - PERMISSION: [NOTINO_SUPER_ADMIN, NOTINO_ADMIN, PARTNER, PARTNER_ADMIN, USER_ROLE_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiB2BV1EmployeesEmployeeIdRole.PathParameters & Paths.PatchApiB2BV1EmployeesEmployeeIdRole.HeaderParameters> | null,
      data?: Paths.PatchApiB2BV1EmployeesEmployeeIdRole.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1EmployeesEmployeeIdRole.Responses.$200>
  }
  ['/api/b2b/v1/roles/salon']: {
    /**
     * getApiB2BV1RolesSalon - PERMISSION: [PARTNER]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiB2BV1RolesSalon.HeaderParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BV1RolesSalon.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
