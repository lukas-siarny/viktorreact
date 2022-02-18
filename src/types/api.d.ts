import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
    namespace DeleteApiV1BusinessCasesBusinessCaseIdNotesBusinessCaseNoteId {
        namespace Parameters {
            export type BusinessCaseID = number;
            export type BusinessCaseNoteID = number;
        }
        export interface PathParameters {
            businessCaseID: Parameters.BusinessCaseID;
            businessCaseNoteID: Parameters.BusinessCaseNoteID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1CommisionsCommisionId {
        namespace Parameters {
            export type CommisionID = number;
        }
        export interface PathParameters {
            commisionID: Parameters.CommisionID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1CompaniesCompanyId {
        namespace Parameters {
            export type CompanyID = number;
        }
        export interface PathParameters {
            companyID: Parameters.CompanyID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1CompanyBranchesCompanyBranchId {
        namespace Parameters {
            export type CompanyBranchID = number;
        }
        export interface PathParameters {
            companyBranchID: Parameters.CompanyBranchID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1DestinationSeasonsDestinationSeasonId {
        namespace Parameters {
            export type DestinationSeasonID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralInsuranceID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalInsuranceID: Parameters.GeneralInsuranceID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralPricelistItemID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalPricelistItemID: Parameters.GeneralPricelistItemID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1DestinationsDestinationId {
        namespace Parameters {
            export type DestinationID = number;
            export type Force = boolean;
        }
        export interface PathParameters {
            destinationID: Parameters.DestinationID;
        }
        export interface QueryParameters {
            force?: Parameters.Force;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId {
        namespace Parameters {
            export type DestinationID = number;
            export type FileID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            destinationID: Parameters.DestinationID;
            fileID: Parameters.FileID;
        }
        export interface QueryParameters {
            webProjectCode?: Parameters.WebProjectCode;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1DiscountsDiscountId {
        namespace Parameters {
            export type DiscountID = number;
        }
        export interface PathParameters {
            discountID: Parameters.DiscountID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsCarriersCarrierId {
        namespace Parameters {
            export type CarrierID = number;
        }
        export interface PathParameters {
            carrierID: Parameters.CarrierID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsCountriesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsCurrenciesCode {
        namespace Parameters {
            export type Code = string;
        }
        export interface PathParameters {
            code: Parameters.Code;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsDepositAmountsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsDiscountMarksDiscountMarkId {
        namespace Parameters {
            export type DiscountMarkID = number;
        }
        export interface PathParameters {
            discountMarkID: Parameters.DiscountMarkID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsExchangeRatesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsFacilityTypesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId {
        namespace Parameters {
            export type InsuranceCompanyID = number;
        }
        export interface PathParameters {
            insuranceCompanyID: Parameters.InsuranceCompanyID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsLanguagesCode {
        namespace Parameters {
            export type Code = string;
        }
        export interface PathParameters {
            code: Parameters.Code;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsMealPlansId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsPersonTypesPersonTypeId {
        namespace Parameters {
            export type PersonTypeID = number;
        }
        export interface PathParameters {
            personTypeID: Parameters.PersonTypeID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsPriceGroupsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsPricelistItemsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsProductCataloguesProductCatalogueId {
        namespace Parameters {
            export type ProductCatalogueID = number;
        }
        export interface PathParameters {
            productCatalogueID: Parameters.ProductCatalogueID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsProductTypesProductTypeId {
        namespace Parameters {
            export type ProductTypeID = number;
        }
        export interface PathParameters {
            productTypeID: Parameters.ProductTypeID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsPropertiesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId {
        namespace Parameters {
            export type ReservationExpirationTimeID = number;
        }
        export interface PathParameters {
            reservationExpirationTimeID: Parameters.ReservationExpirationTimeID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsSalesChannelsSalesChannelId {
        namespace Parameters {
            export type SalesChannelID = number;
        }
        export interface PathParameters {
            salesChannelID: Parameters.SalesChannelID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsSeasonsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsStationsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsTextTemplatesTextTemplateId {
        namespace Parameters {
            export type TextTemplateID = number;
        }
        export interface PathParameters {
            textTemplateID: Parameters.TextTemplateID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId {
        namespace Parameters {
            export type TextItemID = number;
            export type TextTemplateID = number;
        }
        export interface PathParameters {
            textItemID: Parameters.TextItemID;
            textTemplateID: Parameters.TextTemplateID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsUnitTemplatePropertiesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsUnitTemplatesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1EnumerationsVatRatesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1FacilitiesFacilityId {
        namespace Parameters {
            export type FacilityID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId {
        namespace Parameters {
            export type FacilityID = number;
            export type FileID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
            fileID: Parameters.FileID;
        }
        export interface QueryParameters {
            webProjectCode?: Parameters.WebProjectCode;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId {
        namespace Parameters {
            export type FacilityID = number;
            export type UnitTemplateID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
            unitTemplateID: Parameters.UnitTemplateID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1FileTagsId {
        namespace Parameters {
            export type Force = boolean;
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            force?: Parameters.Force;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1FilesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1Folders {
        namespace Parameters {
            export type PathToFolder = string;
        }
        export interface QueryParameters {
            pathToFolder: Parameters.PathToFolder;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1InsurancesInsuranceId {
        namespace Parameters {
            export type InsuranceID = number;
        }
        export interface PathParameters {
            insuranceID: Parameters.InsuranceID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1LinesLineId {
        namespace Parameters {
            export type LineID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1LinesLineIdStationsStationId {
        namespace Parameters {
            export type LineID = number;
            export type StationID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            stationID: Parameters.StationID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1LinesLineIdTermsTermIdStations {
        namespace Parameters {
            export type LineID = number;
            export type TermID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            termID: Parameters.TermID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1LinesLineIdTermsTermIdStationsStationId {
        namespace Parameters {
            export type LineID = number;
            export type StationID = number;
            export type TermID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            termID: Parameters.TermID;
            stationID: Parameters.StationID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1LinesLineIdUnitTemplatesUnitTemplateId {
        namespace Parameters {
            export type LineID = number;
            export type UnitTemplateID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            unitTemplateID: Parameters.UnitTemplateID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1LinesRoadsRoadId {
        namespace Parameters {
            export type RoadID = number;
        }
        export interface PathParameters {
            roadID: Parameters.RoadID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1OrganizationBranchesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1OrganizationsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1PaymentsPaymentId {
        namespace Parameters {
            export type PaymentID = number;
        }
        export interface PathParameters {
            paymentID: Parameters.PaymentID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1RolesRoleId {
        namespace Parameters {
            export type RoleID = number;
        }
        export interface PathParameters {
            roleID: Parameters.RoleID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1RolesRoleIdUnassignUsersUserId {
        namespace Parameters {
            export type RoleID = number;
            export type UserID = number;
        }
        export interface PathParameters {
            roleID: Parameters.RoleID;
            userID: Parameters.UserID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1ServicesServiceId {
        namespace Parameters {
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1ServicesServiceIdGalleryUnassignImagesFileId {
        namespace Parameters {
            export type FileID = number;
            export type ServiceID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            fileID: Parameters.FileID;
        }
        export interface QueryParameters {
            webProjectCode?: Parameters.WebProjectCode;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateId {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemId {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
            export type ServiceUnitTemplatePricelistItemID = string;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            serviceUnitTemplatePricelistItemID: Parameters.ServiceUnitTemplatePricelistItemID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1TermSerialsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1TermSerialsTerms {
        namespace Parameters {
            export type TermIDs = number[];
        }
        export interface QueryParameters {
            termIDs: Parameters.TermIDs;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace DeleteApiV1UsersUserId {
        namespace Parameters {
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace GetApiV1Avatar {
        namespace Parameters {
            export type Initials = string;
            export type Size = number;
            export type T = string;
        }
        export interface QueryParameters {
            size?: Parameters.Size;
            initials: Parameters.Initials;
            t: Parameters.T;
        }
    }
    namespace GetApiV1BusinessCases {
        namespace Parameters {
            export type CompanyID = number;
            export type Limit = 25 | 50 | 100;
            export type MarginFrom = number; // float
            export type Page = number;
            export type PaidFrom = number; // float
            export type PriceFrom = number; // float
            export type Search = string | null;
        }
        export interface QueryParameters {
            priceFrom?: Parameters.PriceFrom /* float */;
            paidFrom?: Parameters.PaidFrom /* float */;
            marginFrom?: Parameters.MarginFrom /* float */;
            companyID?: Parameters.CompanyID;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                businessCases: {
                    id: number;
                    customer: {
                        organization: {
                            name: string;
                        } | null;
                        person: {
                            title: string | null;
                            name: string;
                            surname: string;
                        } | {
                            title: string | null;
                            name: string;
                            surname: string;
                        };
                    };
                    reservation: {
                        id: number;
                        reservationNumber: string;
                        state: "RESERVED" | "EXPIRED" | "EXPIRED_WITH_PAYMENT" | "PARTIALLY_PAID" | "AFTER_EXPIRATION_DATE" | "FULLY_PAID" | "CANCELED";
                        price: number; // float
                        paid: number; // float
                        margin: number; // float
                    };
                    facility: {
                        id: number;
                        name: string;
                    };
                    destination: {
                        id: number;
                        name: string;
                        country: {
                            id: number;
                            name: string;
                            isoCode: string | null;
                        };
                    };
                    term: {
                        id: number;
                        code: string;
                        dateFrom: string; // date-time
                        dateTo: string; // date-time
                    };
                    company: {
                        id: number;
                        name: string;
                        email: string | null; // email
                        phone: string | null;
                        address: {
                            id: number;
                            street?: string | null;
                            streetNumber?: string | null;
                            zip?: string | null;
                            city: string;
                        };
                    };
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
    namespace GetApiV1BusinessCasesBusinessCaseId {
        namespace Parameters {
            export type BusinessCaseID = number;
        }
        export interface PathParameters {
            businessCaseID: Parameters.BusinessCaseID;
        }
        namespace Responses {
            export interface $200 {
                businessCase: {
                    id: number;
                    date: string; // date-time
                    customer: {
                        organization: {
                            name: string;
                            businessID: string | null;
                            taxID: string | null;
                            vatID: string | null;
                            isVATPayer: boolean;
                            phone: string | null;
                            email: string | null;
                            address: {
                                street: string | null;
                                streetNumber: string;
                                orientationNumber: string | null;
                                zip: string;
                                city: string;
                                country: {
                                    id: number;
                                    name: string;
                                };
                            };
                            contactPerson: {
                                title: string | null;
                                name: string;
                                surname: string;
                                phone: string | null;
                                email: string | null; // email
                                address: {
                                    street: string | null;
                                    streetNumber: string;
                                    orientationNumber: string | null;
                                    zip: string;
                                    city: string;
                                    country: {
                                        id: number;
                                        name: string;
                                    };
                                };
                            } | null;
                        } | null;
                        person: {
                            title: string | null;
                            name: string;
                            surname: string;
                            phone: string | null;
                            email: string | null; // email
                            address: {
                                street: string | null;
                                streetNumber: string;
                                orientationNumber: string | null;
                                zip: string;
                                city: string;
                                country: {
                                    id: number;
                                    name: string;
                                };
                            };
                        } | {
                            title: string | null;
                            name: string;
                            surname: string;
                            phone: string | null;
                            email: string | null; // email
                            address: {
                                street: string | null;
                                streetNumber: string;
                                orientationNumber: string | null;
                                zip: string;
                                city: string;
                                country: {
                                    id: number;
                                    name: string;
                                };
                            };
                        };
                    };
                    seller: {
                        user: {
                            id: number;
                            fullName: string;
                            email: string;
                        };
                        companyBranch: {
                            id: number;
                            name: string | null;
                            email: string | null;
                            phone: string | null;
                            address: {
                                street: string | null;
                                streetNumber: string;
                                orientationNumber: string | null;
                                zip: string;
                                city: string;
                                country: {
                                    id: number;
                                    name: string;
                                };
                            };
                        };
                    };
                    company: {
                        id: number;
                        name: string;
                        email: string | null;
                        phone: string | null;
                        address: {
                            street: string | null;
                            streetNumber: string;
                            orientationNumber: string | null;
                            zip: string;
                            city: string;
                            country: {
                                id: number;
                                name: string;
                            };
                        };
                    };
                    reservation: {
                        id: number;
                        reservationNumber: string;
                        expirationDatetime: string; // date-time
                        term: {
                            id: number;
                            code: string;
                            fromDate: string; // date-time
                            toDate: string; // date-time
                        };
                        facility: {
                            id: number;
                            name: string;
                            serviceUnitTemplates: {
                                id: number;
                                name: string;
                                type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                                code: string;
                                unitTemplatePropertyName: string | null;
                                travelerIDs: number[];
                                roomID: number;
                            }[];
                        };
                        destination: {
                            id: number;
                            name: string;
                            country: {
                                id: number;
                                name: string;
                                isoCode: string | null;
                            };
                        };
                        transportation: {
                            lineForth: {
                                id: number;
                                code: string;
                                type: "AIR" | "BUS";
                                serviceUnitTemplates: {
                                    id: number;
                                    name: string;
                                    type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                                    code: string;
                                    unitTemplatePropertyName: string | null;
                                    travelerIDs: number[];
                                }[];
                                datetime: string; // date-time
                            } | null;
                            lineBack: {
                                id: number;
                                code: string;
                                type: "AIR" | "BUS";
                                serviceUnitTemplates: {
                                    id: number;
                                    name: string;
                                    type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                                    code: string;
                                    unitTemplatePropertyName: string | null;
                                    travelerIDs: number[];
                                }[];
                                datetime: string; // date-time
                            } | null;
                            individual: {
                                travelerIDs: number[];
                            };
                        };
                        serviceUnitTemplatePricelistItems: {
                            id: number;
                            name: string;
                            count: number;
                            unitPrice: number; // float
                            totalPrice: number; // float
                            travelerIDs: number[];
                        }[];
                        generalInsurances: {
                            id: number;
                            name: string;
                            count: number;
                            totalPrice: number; // float
                            travelerIDs: number[];
                        }[];
                        generalPricelistItems: {
                            id: number;
                            name: string;
                            count: number;
                            totalPrice: number; // float
                            travelerIDs: number[];
                        }[];
                        price: {
                            totalPriceBeforeDiscount: number; // float
                            totalPriceAfterDiscount: number; // float
                            totalDiscountAbsolute: number; // float
                            totalDiscountPercent: number; // float
                        };
                        payments: {
                            paid: number; // float
                            underpayment: number; // float
                            overpayment: number; // float
                        };
                        documents: {
                            id: number;
                            name: string;
                            path: string;
                            dataType: "PDF" | "IMAGE" | "DOC" | "EXCEL" | "ZIP" | "RAR" | "OTHER";
                            createdAt: string; // date-time
                        }[];
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1BusinessCasesBusinessCaseIdNotes {
        namespace Parameters {
            export type BusinessCaseID = number;
        }
        export interface PathParameters {
            businessCaseID: Parameters.BusinessCaseID;
        }
        namespace Responses {
            export interface $200 {
                businessCaseNotes: {
                    id: number;
                    note: string;
                    creator?: {
                        id: number;
                        fullName: string;
                    };
                    createdAt: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiV1BusinessCasesBusinessCaseIdTravelers {
        namespace Parameters {
            export type BusinessCaseID = number;
        }
        export interface PathParameters {
            businessCaseID: Parameters.BusinessCaseID;
        }
        namespace Responses {
            export interface $200 {
                travelers: {
                    id: number;
                    order: number;
                    isContact: boolean;
                    passport: string | null;
                    passportValidTo: string | null; // date-time
                    person: {
                        id: number;
                        name: string;
                        surname: string;
                        birthdate: string; // date-time
                        phone: string | null;
                        email: string | null; // email
                        address: {
                            id: number;
                            street: string | null;
                            streetNumber: string;
                            orientationNumber: string | null;
                            zip: string;
                            city: string;
                            country: {
                                id: number;
                                name: string;
                            };
                        } | null;
                    };
                    personType: {
                        id: number;
                        name: string;
                    };
                }[];
            }
        }
    }
    namespace GetApiV1Commisions {
        namespace Parameters {
            export type CompanyIDs = number[];
            export type Limit = 25 | 50 | 100;
            export type Page = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            companyIDs?: Parameters.CompanyIDs;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                commisions: {
                    id: number;
                    name: string;
                    validFrom: string | null; // date-time
                    validTo: string | null; // date-time
                    value: number; // float
                    companies: {
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
    namespace GetApiV1CommisionsCommisionId {
        namespace Parameters {
            export type CommisionID = number;
        }
        export interface PathParameters {
            commisionID: Parameters.CommisionID;
        }
        namespace Responses {
            export interface $200 {
                commision: {
                    id: number;
                    name: string;
                    validFrom?: string | null; // date-time
                    validTo?: string | null; // date-time
                    value: number; // float
                    companies: {
                        id: number;
                        name: string;
                    }[];
                    productTypes: {
                        id: number;
                        name: string;
                    }[];
                    allowedDestinations: {
                        id: number;
                        name: string;
                    }[];
                    allowedDestinationSeasons: {
                        id: number;
                        name: string;
                    }[];
                    allowedFacilities: {
                        id: number;
                        name: string;
                    }[];
                };
            }
        }
    }
    namespace GetApiV1Companies {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type Page = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                companies: {
                    id: number;
                    name: string;
                    addresses: [
                        {
                            id: number;
                            street: string | null;
                            streetNumber: string | null;
                            orientationNumber: string | null;
                            description: string | null;
                            zip: string | null;
                            city: string;
                            pobox: string | null;
                            country: {
                                id: number;
                                name: string;
                            };
                            type: "ORGANIZATION";
                        }
                    ];
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
    namespace GetApiV1CompaniesCompanyId {
        namespace Parameters {
            export type CompanyID = number;
        }
        export interface PathParameters {
            companyID: Parameters.CompanyID;
        }
        namespace Responses {
            export interface $200 {
                company: {
                    id: number;
                    name: string;
                    businessID: string | null;
                    taxID: string | null;
                    vatID: string | null;
                    isVATPayer: boolean;
                    web: string | null;
                    phone: string | null;
                    email: string | null;
                    generalTermsAndConditionsUrl: string | null;
                    commercialRegisterEntry: string | null;
                    color: string; // ^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
                    iban: string; // ^[a-zA-Z0-9]*$
                    swift: string /* ^[a-zA-Z0-9]*$ */ | string /* ^[a-zA-Z0-9]*$ */;
                    addresses: [
                        {
                            id: number;
                            street: string | null;
                            streetNumber: string | null;
                            orientationNumber: string | null;
                            description: string | null;
                            zip: string | null;
                            city: string;
                            pobox: string | null;
                            country: {
                                id: number;
                                name: string;
                            };
                            types: [
                                ("ORGANIZATION")
                            ];
                        }
                    ];
                    stampFile: {
                        id: number;
                        name: string;
                        path: string;
                    } | null;
                    webProject: {
                        code: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR";
                        name: string;
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1CompaniesCompanyIdCompanyBranches {
        namespace Parameters {
            export type CompanyID = number;
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type Search = string | null;
        }
        export interface PathParameters {
            companyID: Parameters.CompanyID;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                companyBranches: {
                    id: number;
                    code: number;
                    name: string | null;
                    addresses: [
                        {
                            id: number;
                            street: string | null;
                            streetNumber: string | null;
                            orientationNumber: string | null;
                            description: string | null;
                            zip: string | null;
                            city: string;
                            pobox: string | null;
                            country: {
                                id: number;
                                name: string;
                            };
                            type: "ORGANIZATION";
                        }
                    ];
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
    namespace GetApiV1CompanyBranches {
        namespace Parameters {
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
                companyBranches: {
                    id: number;
                    code: number;
                    name: string | null;
                    company: {
                        id: number;
                        name: string;
                    };
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
    namespace GetApiV1CompanyBranchesCompanyBranchId {
        namespace Parameters {
            export type CompanyBranchID = number;
        }
        export interface PathParameters {
            companyBranchID: Parameters.CompanyBranchID;
        }
        namespace Responses {
            export interface $200 {
                companyBranch: {
                    id: number;
                    code: number;
                    name: string | null;
                    phone: string | null;
                    email: string | null;
                    fax: string | null;
                    info: string | null;
                    openingHours: [
                        {
                            day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                            note?: string | null;
                            timeRanges: {
                                timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            }[];
                        },
                        {
                            day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                            note?: string | null;
                            timeRanges: {
                                timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            }[];
                        },
                        {
                            day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                            note?: string | null;
                            timeRanges: {
                                timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            }[];
                        },
                        {
                            day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                            note?: string | null;
                            timeRanges: {
                                timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            }[];
                        },
                        {
                            day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                            note?: string | null;
                            timeRanges: {
                                timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            }[];
                        },
                        {
                            day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                            note?: string | null;
                            timeRanges: {
                                timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            }[];
                        },
                        {
                            day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                            note?: string | null;
                            timeRanges: {
                                timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                                timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                            }[];
                        }
                    ] | null;
                    addresses: [
                        {
                            id: number;
                            street: string | null;
                            streetNumber: string | null;
                            orientationNumber: string | null;
                            description: string | null;
                            zip: string | null;
                            city: string;
                            pobox: string | null;
                            country: {
                                id: number;
                                name: string;
                            };
                            types: [
                                ("ORGANIZATION")
                            ];
                        }
                    ];
                    company: {
                        id: number;
                        name: string;
                    };
                };
            }
        }
    }
    namespace GetApiV1CompanyBranchesCompanyBranchIdOrganizations {
        namespace Parameters {
            export type CompanyBranchID = number;
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type Search = string | null;
        }
        export interface PathParameters {
            companyBranchID: Parameters.CompanyBranchID;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                organizations: {
                    id: number;
                    name: string | null;
                    address: {
                        id: number;
                        street: string | null;
                        streetNumber: string | null;
                        orientationNumber: string | null;
                        description: string | null;
                        zip: string | null;
                        city: string;
                        pobox: string | null;
                        country: {
                            id: number;
                            name: string;
                        } | null;
                    } | null;
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
    namespace GetApiV1Customers {
        namespace Parameters {
            export type CustomerType = "INDIVIDUAL" | "LEGAL";
            export type Limit = 25 | 50 | 100;
            export type Page = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            customerType: Parameters.CustomerType;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                customers: {
                    id: number;
                    fullName: string;
                    companyName: string | null;
                    contactPersonFullName: string | null;
                    businessID: string | null;
                    phone: string | null;
                    email: string | null; // email
                    address: {
                        id: number;
                        street: string | null;
                        streetNumber: string;
                        orientationNumber: string | null;
                        zip: string;
                        city: string;
                        country: {
                            id: number;
                            name: string;
                        };
                    };
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
    namespace GetApiV1CustomersCustomerId {
        namespace Parameters {
            export type CustomerID = number;
        }
        export interface PathParameters {
            customerID: Parameters.CustomerID;
        }
        namespace Responses {
            export interface $200 {
                customer: {
                    id: number;
                    type: "INDIVIDUAL" | "LEGAL";
                    marketingAgreement: boolean;
                    organization: {
                        name: string;
                        businessID: string | null;
                        taxID: string | null;
                        vatID: string | null;
                        isVATPayer: boolean;
                        phone: string | null;
                        email: string | null; // email
                        address: {
                            street: string | null;
                            streetNumber: string;
                            orientationNumber: string | null;
                            zip: string;
                            city: string;
                            country: {
                                id: number;
                                name: string;
                            };
                        } | null;
                        contactPerson: {
                            title: string | null;
                            name: string;
                            surname: string;
                            phone: string | null;
                            email: string | null; // email
                            address: {
                                street: string | null;
                                streetNumber: string;
                                orientationNumber: string | null;
                                zip: string;
                                city: string;
                                country: {
                                    id: number;
                                    name: string;
                                };
                            } | null;
                        };
                    } | null;
                    person: {
                        title: string | null;
                        name: string;
                        surname: string;
                        phone: string | null;
                        email: string | null; // email
                        address: {
                            street: string | null;
                            streetNumber: string;
                            orientationNumber: string | null;
                            zip: string;
                            city: string;
                            country: {
                                id: number;
                                name: string;
                            };
                        } | null;
                    } | {
                        title: string | null;
                        name: string;
                        surname: string;
                        phone: string | null;
                        email: string | null; // email
                        address: {
                            street: string | null;
                            streetNumber: string;
                            orientationNumber: string | null;
                            zip: string;
                            city: string;
                            country: {
                                id: number;
                                name: string;
                            };
                        } | null;
                    };
                };
            }
        }
    }
    namespace GetApiV1DestinationSeasons {
        namespace Parameters {
            export type DestinationIDs = number[];
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type PublicationStatus = "PUBLISHED" | "UNPUBLISHED" | "ALL";
            export type Search = string | null;
            export type SeasonID = number;
        }
        export interface QueryParameters {
            publicationStatus?: Parameters.PublicationStatus;
            destinationIDs?: Parameters.DestinationIDs;
            seasonID?: Parameters.SeasonID;
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                destinationSeasons: {
                    id: number;
                    name: string;
                    published: boolean;
                    destination: {
                        id: number;
                        name: string;
                    } | null;
                    season: {
                        id: number;
                        name: string;
                    } | null;
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
    namespace GetApiV1DestinationSeasonsDestinationSeasonId {
        namespace Parameters {
            export type DestinationSeasonID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        namespace Responses {
            export interface $200 {
                destinationSeason: {
                    id: number;
                    name: string;
                    published: boolean;
                    destination: {
                        id: number;
                        name: string;
                    } | null;
                    season: {
                        id: number;
                        name: string;
                    } | null;
                    vatRate: {
                        id: number;
                        label: string;
                    } | null;
                    productTypes: {
                        id: number;
                        name: string;
                    }[];
                    productCatalogues: {
                        id: number;
                        name: string;
                    }[];
                    webProjects: {
                        code: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        name: string;
                    }[];
                    errorsCount: number;
                    warningsCount: number;
                };
            }
        }
    }
    namespace GetApiV1DestinationSeasonsDestinationSeasonIdErrors {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type Limit = 1 | 5 | 25 | 50 | 100;
            export type Page = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                errors: {
                    termID: null | number;
                    termCode: string | null;
                    termSerialName: string | null;
                    errors: {
                        code: number;
                        message: string;
                        type: string;
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
    namespace GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralInsuranceID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalInsuranceID: Parameters.GeneralInsuranceID;
        }
        namespace Responses {
            export interface $200 {
                generalInsurance: {
                    id: number;
                    name: string;
                    description: string;
                    insuranceContractNumber: string;
                    personPrice: number; // float
                    destinationSeason: {
                        id: number;
                        name: string;
                    };
                    insurance: {
                        id: number;
                        name: string;
                    };
                    currency: {
                        code: string;
                        sign: string;
                    };
                    insuranceCompany: {
                        id: number;
                        name: string;
                    };
                    personType: {
                        id: number;
                        name: string;
                    };
                    file: {
                        id: number;
                        name: string;
                        path: string;
                    };
                };
            }
        }
    }
    namespace GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralInsuranceID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalInsuranceID: Parameters.GeneralInsuranceID;
        }
        namespace Responses {
            export interface $200 {
                costSeasons: {
                    id: number;
                    value: number; // float
                    validityAllTerms: boolean;
                    costSeasonItems: [
                    ] | [
                        {
                            id: number;
                            dateFrom: string; // date-time
                            dateTo: string; // date-time
                        },
                        ...{
                            id: number;
                            dateFrom: string; // date-time
                            dateTo: string; // date-time
                        }[]
                    ];
                }[];
            }
        }
    }
    namespace GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type Limit = 25 | 50 | 100 | 1000;
            export type Page = number;
            export type Search = string | null;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                generalPricelistItemsAndInsurances: {
                    id: number;
                    name: string;
                    type: "PRICELIST_ITEM" | "INSURANCE";
                    price: number; // float
                    timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
                    unitRelation: "PERSON" | "UNIT";
                    costSeasons: {
                        id: number;
                        value: number; // float
                        validityAllTerms: boolean;
                        costSeasonItems: [
                        ] | [
                            {
                                id: number;
                                dateFrom: string; // date-time
                                dateTo: string; // date-time
                            },
                            ...{
                                id: number;
                                dateFrom: string; // date-time
                                dateTo: string; // date-time
                            }[]
                        ];
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
    namespace GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralPricelistItemID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalPricelistItemID: Parameters.GeneralPricelistItemID;
        }
        namespace Responses {
            export interface $200 {
                generalPricelistItem: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    extraBed: [
                        number
                    ] | [
                        ("OCCUPANCY_ALL_PERSONS_EXTRA_BED")
                    ] | null;
                    withoutBed: [
                        number
                    ] | [
                        ("OCCUPANCY_ALL_PERSONS_WITHOUT_BED")
                    ] | null;
                    usage: "FACILITY" | "TRANSPORTATION";
                    category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
                    timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
                    unitRelation: "PERSON" | "UNIT";
                    params: {
                        value: number;
                    } | null;
                    price: number; // float
                    destinationSeason: {
                        id: number;
                        name: string;
                    };
                    pricelistItem: {
                        id: number;
                        name: string;
                    };
                    personTypes: {
                        id: number;
                        name: string;
                    }[];
                };
            }
        }
    }
    namespace GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralPricelistItemID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalPricelistItemID: Parameters.GeneralPricelistItemID;
        }
        namespace Responses {
            export interface $200 {
                costSeasons: {
                    id: number;
                    value: number; // float
                    validityAllTerms: boolean;
                    costSeasonItems: [
                    ] | [
                        {
                            id: number;
                            dateFrom: string; // date-time
                            dateTo: string; // date-time
                        },
                        ...{
                            id: number;
                            dateFrom: string; // date-time
                            dateTo: string; // date-time
                        }[]
                    ];
                }[];
            }
        }
    }
    namespace GetApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type ServiceType = "TRANSPORTATION" | "FACILITY";
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        export interface QueryParameters {
            serviceType?: Parameters.ServiceType;
        }
        namespace Responses {
            export interface $200 {
                hasUnpublishedPrices: boolean;
            }
        }
    }
    namespace GetApiV1DestinationSeasonsDestinationSeasonIdWarnings {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type Limit = 1 | 5 | 25 | 50 | 100;
            export type Page = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                warnings: {
                    termID: number;
                    termCode: string | null;
                    warnings: {
                        code: number;
                        message: string;
                        type: string;
                        meta: {
                            termID: number;
                            destinationSeasonID: null | number;
                            serviceUnitTemplatePricelistItemID: null | number;
                            costSeasonID: null | number;
                            costSeasonItemID: null | number;
                        };
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
    namespace GetApiV1DestinationSeasonsExport {
        namespace Parameters {
            export type DestinationSeasonIDs = [
                number,
                ...number[]
            ];
        }
        export interface QueryParameters {
            destinationSeasonIDs: Parameters.DestinationSeasonIDs;
        }
    }
    namespace GetApiV1Destinations {
        namespace Parameters {
            export type CountryID = number;
            export type DestinationID = number;
            export type Limit = 25 | 50 | 100 | 1000;
            export type Order = string;
            export type Page = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            countryID?: Parameters.CountryID;
            destinationID?: Parameters.DestinationID;
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                destinations: {
                    id: number;
                    name: string;
                    nameSlug: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                    timezone: string | null;
                    hasChildren: boolean;
                    country: {
                        id: number;
                        name: string;
                        isoCode: string | null;
                    } | null;
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
    namespace GetApiV1DestinationsDestinationId {
        namespace Parameters {
            export type DestinationID = number;
        }
        export interface PathParameters {
            destinationID: Parameters.DestinationID;
        }
        namespace Responses {
            export interface $200 {
                destination: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    hasChildren: boolean;
                    latitude: number; // float
                    longitude: number; // float
                    zoom: number;
                    timezone: string | null;
                    parent: {
                        id: number;
                        name: string;
                    } | null;
                    country: {
                        id: number;
                        name: string;
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1DestinationsDestinationIdGallery {
        namespace Parameters {
            export type DestinationID = number;
            export type WebProject = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            destinationID: Parameters.DestinationID;
        }
        export interface QueryParameters {
            webProject?: Parameters.WebProject;
        }
        namespace Responses {
            export interface $200 {
                destination: {
                    id: number;
                    gallery: {
                        [key: string]: any;
                    };
                };
            }
        }
    }
    namespace GetApiV1DestinationsDestinationIdTextItems {
        namespace Parameters {
            export type DestinationID = number;
            export type TextTemplateID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            destinationID: Parameters.DestinationID;
        }
        export interface QueryParameters {
            textTemplateID: Parameters.TextTemplateID;
            webProjectCode: Parameters.WebProjectCode;
        }
        namespace Responses {
            export interface $200 {
                textItems?: {
                    id: number;
                    name: string;
                    xmlName: string;
                    maxLength: number;
                    destinationTextItems: {
                        textItemID: number;
                        localization?: {
                            id: number;
                            values: {
                                languageCode: string;
                                value: string | null;
                            }[];
                        };
                    }[];
                }[];
            }
        }
    }
    namespace GetApiV1Discounts {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type Search = string | null;
            export type Type = "OLD_BUSINESS_CASE" | "NEW_BUSINESS_CASE" | "LIMIT_CAPACITY_UNIT_TEMPLATE" | "TRIP" | "CASHBACK";
        }
        export interface QueryParameters {
            type?: Parameters.Type;
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                discounts: {
                    id: number;
                    name: string;
                    validFrom: string | null; // date-time
                    validTo: string | null; // date-time
                    type: "OLD_BUSINESS_CASE" | "NEW_BUSINESS_CASE" | "LIMIT_CAPACITY_UNIT_TEMPLATE" | "TRIP" | "CASHBACK";
                    value: number; // float
                    valueType: "PERCENT" | "FIX";
                    discountMarks: {
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
    namespace GetApiV1DiscountsDiscountId {
        namespace Parameters {
            export type DiscountID = number;
        }
        export interface PathParameters {
            discountID: Parameters.DiscountID;
        }
        namespace Responses {
            export interface $200 {
                id: number;
                name: string;
                validFrom: string | null; // date-time
                validTo: string | null; // date-time
                type: "OLD_BUSINESS_CASE" | "NEW_BUSINESS_CASE" | "LIMIT_CAPACITY_UNIT_TEMPLATE" | "TRIP" | "CASHBACK";
                value: number; // float
                valueType: "PERCENT" | "FIX";
                applyCount: number;
                unitTemplateType: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                transportationType: "AIR" | "BUS" | "INDIVIDUAL";
                discountMarks: {
                    id: number;
                    name: string;
                }[];
                productTypes: {
                    id: number;
                    name: string;
                }[];
                allowedDestinations: {
                    id: number;
                    name: string;
                }[];
                allowedDestinationSeasons: {
                    id: number;
                    name: string;
                }[];
                disallowedDestinationSeasons: {
                    id: number;
                    name: string;
                }[];
                allowedFacilities: {
                    id: number;
                    name: string;
                }[];
                allowedServiceUnitTemplates: {
                    id: number;
                    name: string;
                }[];
            }
        }
    }
    namespace GetApiV1DiscountsServiceUnitTemplates {
        namespace Parameters {
            export type DestinationIDs = number[];
            export type DestinationSeasonIDs = number[];
            export type Limit = 25 | 50 | 100;
            export type Page = number;
            export type Search = string | null;
            export type Type = "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
        }
        export interface QueryParameters {
            type?: Parameters.Type;
            destinationIDs?: Parameters.DestinationIDs;
            destinationSeasonIDs?: Parameters.DestinationSeasonIDs;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                serviceUnitTemplates: {
                    id: number;
                    name: string;
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
    namespace GetApiV1DocumentsReservationsReservationId {
        namespace Parameters {
            export type ReservationID = number;
        }
        export interface PathParameters {
            reservationID: Parameters.ReservationID;
        }
        namespace Responses {
            export interface $200 {
                fileName: string;
                filePath: string;
            }
        }
    }
    namespace GetApiV1DocumentsReservationsReservationIdExport {
        namespace Parameters {
            export type ReservationID = number;
        }
        export interface PathParameters {
            reservationID: Parameters.ReservationID;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsCarriers {
        namespace Parameters {
            export type Limit = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                carriers: {
                    id: number;
                    name: string;
                    businessID: string | null;
                    taxID: string | null;
                    vatID: string | null;
                    isVATPayer: boolean;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsCarriersCarrierId {
        namespace Parameters {
            export type CarrierID = number;
        }
        export interface PathParameters {
            carrierID: Parameters.CarrierID;
        }
        namespace Responses {
            export interface $200 {
                carrier: {
                    id: number;
                    name: string;
                    businessID: string | null;
                    taxID: string | null;
                    vatID: string | null;
                    isVATPayer: boolean;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsCountries {
        namespace Parameters {
            export type DestinationID = number;
            export type Limit = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            destinationID?: Parameters.DestinationID;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                countries: {
                    id: number;
                    name: string;
                    nameSlug: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                    isoCode: string | null;
                    vatRate: {
                        id: number;
                        label: string;
                    } | null;
                    currency: {
                        code: string;
                        sign: string;
                    } | null;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsCountriesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                country: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    isoCode: string | null;
                    vatRate: {
                        id: number;
                        label: string;
                    } | null;
                    currency: {
                        code: string;
                        sign: string;
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsCurrencies {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                currencies: {
                    id: string;
                    code: string;
                    sign: string;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsCurrenciesCode {
        namespace Parameters {
            export type Code = string;
        }
        export interface PathParameters {
            code: Parameters.Code;
        }
        namespace Responses {
            export interface $200 {
                currency: {
                    code: string;
                    sign: string;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsDepositAmounts {
        namespace Parameters {
            export type Limit = number;
            export type StartDate = string; // date-time
        }
        export interface QueryParameters {
            startDate?: Parameters.StartDate /* date-time */;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                depositAmounts: {
                    id: number;
                    percent: number; // float
                    daysTillDepart: number;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsDepositAmountsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                depositAmount: {
                    id: number;
                    percent: number; // float
                    daysTillDepart: number;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsDiscountMarks {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                discountMarks: {
                    id: number; // float
                    name: string;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsDiscountMarksDiscountMarkId {
        namespace Parameters {
            export type DiscountMarkID = number;
        }
        export interface PathParameters {
            discountMarkID: Parameters.DiscountMarkID;
        }
        namespace Responses {
            export interface $200 {
                discountMark: {
                    id: number; // float
                    name: string;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsExchangeRates {
        namespace Parameters {
            export type CurrencyCodeFrom = string;
            export type CurrencyCodeTo = string;
            export type FromDateFrom = string; // date-time
            export type FromDateTo = string; // date-time
            export type Limit = number;
            export type ToDateFrom = string; // date-time
            export type ToDateTo = string; // date-time
        }
        export interface QueryParameters {
            fromDateFrom?: Parameters.FromDateFrom /* date-time */;
            toDateFrom?: Parameters.ToDateFrom /* date-time */;
            fromDateTo?: Parameters.FromDateTo /* date-time */;
            toDateTo?: Parameters.ToDateTo /* date-time */;
            currencyCodeFrom?: Parameters.CurrencyCodeFrom;
            currencyCodeTo?: Parameters.CurrencyCodeTo;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                exchangeRates: {
                    id: number;
                    dateFrom: string; // date-time
                    dateTo: string; // date-time
                    currencyCodeFrom: string;
                    currencyCodeTo: string;
                    value: number; // float
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsExchangeRatesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                exchangeRate: {
                    id: number;
                    dateFrom: string; // date-time
                    dateTo: string; // date-time
                    currencyCodeFrom: string;
                    currencyCodeTo: string;
                    value: number; // float
                };
            }
        }
    }
    namespace GetApiV1EnumerationsFacilityTypes {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                facilityTypes: {
                    id: number;
                    name: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsFacilityTypesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                facilityType: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                };
            }
        }
    }
    namespace GetApiV1EnumerationsInsuranceCompanies {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                insuranceCompanies: {
                    id: number;
                    name: string;
                    address: {
                        id: number;
                        street: string;
                        streetNumber: string;
                        orientationNumber: string | null;
                        description: string | null;
                        zip: string;
                        city: string;
                        pobox: string | null;
                        country: {
                            id: number;
                            name: string;
                        };
                    };
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId {
        namespace Parameters {
            export type InsuranceCompanyID = number;
        }
        export interface PathParameters {
            insuranceCompanyID: Parameters.InsuranceCompanyID;
        }
        namespace Responses {
            export interface $200 {
                insuranceCompany: {
                    id: number;
                    name: string;
                    businessID: string;
                    businessRegistration: string;
                    taxID: string;
                    vatID: string;
                    web: string;
                    email: string; // email
                    infoLine: string;
                    emergencyLine: string;
                    address: {
                        id: number;
                        street: string;
                        streetNumber: string;
                        orientationNumber: string | null;
                        description: string | null;
                        zip: string;
                        city: string;
                        pobox: string | null;
                        country: {
                            id: number;
                            name: string;
                        };
                    };
                    logo: {
                        id: number;
                        name: string;
                        path: string;
                    };
                    generalInsuranceConditions: {
                        id: number;
                        name: string;
                        path: string;
                    };
                };
            }
        }
    }
    namespace GetApiV1EnumerationsLanguages {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                languages: {
                    id: string;
                    code: string;
                    name: string;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsLanguagesCode {
        namespace Parameters {
            export type Code = string;
        }
        export interface PathParameters {
            code: Parameters.Code;
        }
        namespace Responses {
            export interface $200 {
                language: {
                    code: string;
                    name: string;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsMealPlans {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                mealPlans: {
                    id: number;
                    name: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                    label: string;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsMealPlansId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                mealPlan: {
                    id: number;
                    name: string;
                    label: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                };
            }
        }
    }
    namespace GetApiV1EnumerationsPersonTypes {
        namespace Parameters {
            export type Limit = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                personTypes: {
                    id: number;
                    name: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                    ageFrom: number;
                    ageTo: number;
                    order: number;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsPersonTypesPersonTypeId {
        namespace Parameters {
            export type PersonTypeID = number;
        }
        export interface PathParameters {
            personTypeID: Parameters.PersonTypeID;
        }
        namespace Responses {
            export interface $200 {
                personType: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    ageFrom: number;
                    ageTo: number;
                    order: number;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsPriceGroups {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                priceGroups: {
                    id: number;
                    name: string;
                    color: string; // ^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsPriceGroupsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                priceGroup: {
                    id: number;
                    name: string;
                    color: string; // ^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
                };
            }
        }
    }
    namespace GetApiV1EnumerationsPricelistItems {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type Page = number;
            export type Search = string | null;
            export type Usage = "FACILITY" | "TRANSPORTATION";
        }
        export interface QueryParameters {
            usage?: Parameters.Usage;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                pricelistItems: {
                    id: number;
                    name: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                    usage: "FACILITY" | "TRANSPORTATION";
                    category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
                    timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
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
    namespace GetApiV1EnumerationsPricelistItemsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                pricelistItem: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    usage: "FACILITY" | "TRANSPORTATION";
                    category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
                    timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
                    unitRelation: "PERSON" | "UNIT";
                    params: {
                        value: number;
                    } | null;
                    personTypes: {
                        id: number;
                        name: string;
                    }[];
                    mealPlan?: {
                        id: number;
                        name: string;
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsProductCatalogues {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                productCatalogues: {
                    id: number;
                    name: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsProductCataloguesProductCatalogueId {
        namespace Parameters {
            export type ProductCatalogueID = number;
        }
        export interface PathParameters {
            productCatalogueID: Parameters.ProductCatalogueID;
        }
        namespace Responses {
            export interface $200 {
                productCatalogue: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                };
            }
        }
    }
    namespace GetApiV1EnumerationsProductTypes {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                productTypes: {
                    id: number;
                    name: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsProductTypesProductTypeId {
        namespace Parameters {
            export type ProductTypeID = number;
        }
        export interface PathParameters {
            productTypeID: Parameters.ProductTypeID;
        }
        namespace Responses {
            export interface $200 {
                productType: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                };
            }
        }
    }
    namespace GetApiV1EnumerationsProperties {
        namespace Parameters {
            export type Limit = number;
            export type Search = string | null;
            export type Type = "BOOLEAN" | "NUMBER" | "TEXT";
            export type Usage = "FACILITY";
        }
        export interface QueryParameters {
            type?: Parameters.Type;
            usage?: Parameters.Usage;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                properties: {
                    id: number;
                    name: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                    usage: "FACILITY";
                    type: "BOOLEAN" | "NUMBER" | "TEXT";
                    order: number;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsPropertiesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                property: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    usage: "FACILITY";
                    type: "BOOLEAN" | "NUMBER" | "TEXT";
                };
            }
        }
    }
    namespace GetApiV1EnumerationsReservationExpirationTimes {
        namespace Parameters {
            export type Limit = number;
            export type TermID = number;
        }
        export interface QueryParameters {
            termID?: Parameters.TermID;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                reservationExpirationTimes: {
                    id: number;
                    name: string;
                    daysBefore: number;
                    expirationValue: number;
                    expirationType: "HOUR" | "DAY" | "MINUTE";
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId {
        namespace Parameters {
            export type ReservationExpirationTimeID = number;
        }
        export interface PathParameters {
            reservationExpirationTimeID: Parameters.ReservationExpirationTimeID;
        }
        namespace Responses {
            export interface $200 {
                reservationExpirationTime: {
                    id: number;
                    name: string;
                    daysBefore: number;
                    expirationValue: number;
                    expirationType: "HOUR" | "DAY" | "MINUTE";
                };
            }
        }
    }
    namespace GetApiV1EnumerationsSalesChannels {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                salesChannels: {
                    id: number; // float
                    name: string;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsSalesChannelsSalesChannelId {
        namespace Parameters {
            export type SalesChannelID = number;
        }
        export interface PathParameters {
            salesChannelID: Parameters.SalesChannelID;
        }
        namespace Responses {
            export interface $200 {
                salesChannel: {
                    id: number; // float
                    name: string;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsSeasons {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                seasons: {
                    id: number;
                    name: string;
                    dateFrom: string; // date-time
                    dateTo: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsSeasonsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                season: {
                    id: number;
                    name: string;
                    dateFrom: string; // date-time
                    dateTo: string; // date-time
                };
            }
        }
    }
    namespace GetApiV1EnumerationsStations {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type Search = string | null;
            export type Type = "AIR" | "BUS" | "ALL";
        }
        export interface QueryParameters {
            type?: Parameters.Type;
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                stations: {
                    id: number;
                    name: string;
                    description: string | null;
                    code: string;
                    type: "AIR" | "BUS";
                    timezone: string;
                    destination: {
                        id: number;
                        name: string;
                    };
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
    namespace GetApiV1EnumerationsStationsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                station: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    description: string | null;
                    descriptionLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    code: string;
                    type: "AIR" | "BUS";
                    timezone: string;
                    destination: {
                        id: number;
                        name: string;
                    };
                };
            }
        }
    }
    namespace GetApiV1EnumerationsTextTemplates {
        namespace Parameters {
            export type Limit = number;
            export type Search = string | null;
            export type Usage = "DESTINATION" | "AIR_TRANSPORT" | "BUS_TRANSPORT" | "SERVICE";
        }
        export interface QueryParameters {
            usage?: Parameters.Usage;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                textTemplates: {
                    id: number;
                    name: string;
                    usage: "DESTINATION" | "AIR_TRANSPORT" | "BUS_TRANSPORT" | "SERVICE";
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsTextTemplatesTextTemplateId {
        namespace Parameters {
            export type TextTemplateID = number;
        }
        export interface PathParameters {
            textTemplateID: Parameters.TextTemplateID;
        }
        namespace Responses {
            export interface $200 {
                textTemplate: {
                    id: number;
                    name: string;
                    usage: "DESTINATION" | "AIR_TRANSPORT" | "BUS_TRANSPORT" | "SERVICE";
                    textItems: {
                        id: number;
                        maxLength: number;
                        name: string;
                        xmlName: string;
                    }[];
                };
            }
        }
    }
    namespace GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItems {
        namespace Parameters {
            export type Limit = number;
            export type TextTemplateID = number;
        }
        export interface PathParameters {
            textTemplateID: Parameters.TextTemplateID;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                textItems: {
                    id: number;
                    maxLength: number;
                    name: string;
                    xmlName: string;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId {
        namespace Parameters {
            export type TextItemID = number;
            export type TextTemplateID = number;
        }
        export interface PathParameters {
            textItemID: Parameters.TextItemID;
            textTemplateID: Parameters.TextTemplateID;
        }
        namespace Responses {
            export interface $200 {
                textItem: {
                    id: number;
                    textTemplateID: number;
                    maxLength: number;
                    name: string;
                    xmlName: string;
                    textTemplate: {
                        name: string;
                        usage: "DESTINATION" | "AIR_TRANSPORT" | "BUS_TRANSPORT" | "SERVICE";
                    };
                };
            }
        }
    }
    namespace GetApiV1EnumerationsUnitTemplateProperties {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                unitTemplateProperties: {
                    id: number;
                    name: string;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsUnitTemplatePropertiesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                unitTemplateProperty: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                };
            }
        }
    }
    namespace GetApiV1EnumerationsUnitTemplates {
        namespace Parameters {
            export type Limit = number;
            export type Search = string | null;
            export type Type = "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
        }
        export interface QueryParameters {
            type?: Parameters.Type;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                unitTemplates: {
                    id: number;
                    name: string;
                    description: string | null;
                    type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                    code: string;
                    fixedCount: number;
                    extraBedCount: number;
                    withoutBedCount: number;
                    minimumPersonCount: number;
                    facilityType: string | null;
                    unitTemplateProperty: {
                        id: number;
                        name: string;
                    } | null;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsUnitTemplatesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                unitTemplate: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    description: string | null;
                    descriptionLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                    code: string;
                    fixedCount: number;
                    extraBedCount: number;
                    withoutBedCount: number;
                    minimumPersonCount: number;
                    facilityType: string | null;
                    unitTemplateProperty: {
                        id: number;
                        name: string;
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsVatRates {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                vatRates: {
                    id: number; // float
                    value: number; // float
                    label: string;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsVatRatesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                vatRate: {
                    id: number; // float
                    value: number; // float
                    label: string;
                };
            }
        }
    }
    namespace GetApiV1EnumerationsWebProjects {
        namespace Parameters {
            export type Limit = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
        }
        namespace Responses {
            export interface $200 {
                webProjects: {
                    id: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                    code: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                    name: string;
                }[];
            }
        }
    }
    namespace GetApiV1EnumerationsWebProjectsCode {
        namespace Parameters {
            export type Code = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            code: Parameters.Code;
        }
        namespace Responses {
            export interface $200 {
                webProject: {
                    code: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                    name: string;
                };
            }
        }
    }
    namespace GetApiV1Exports {
        namespace Parameters {
            export type FileName = string;
            export type T = string;
        }
        export interface QueryParameters {
            fileName: Parameters.FileName;
            t?: Parameters.T;
        }
    }
    namespace GetApiV1Facilities {
        namespace Parameters {
            export type DestinationIDs = number[];
            export type FacilityTypeID = number;
            export type IncludeDestinationChildren = boolean;
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type Published = boolean;
            export type Search = string | null;
        }
        export interface QueryParameters {
            facilityTypeID?: Parameters.FacilityTypeID;
            destinationIDs?: Parameters.DestinationIDs;
            includeDestinationChildren?: Parameters.IncludeDestinationChildren;
            published?: Parameters.Published;
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                facilities: {
                    id: number;
                    name: string;
                    published: boolean;
                    availableLocalizations: {
                        languageCode: string;
                        hasLocalization: boolean;
                    }[];
                    facilityType: {
                        id: number;
                        name: string;
                    } | null;
                    destination: {
                        id: number;
                        name: string;
                    } | null;
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
    namespace GetApiV1FacilitiesFacilityId {
        namespace Parameters {
            export type FacilityID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
        }
        namespace Responses {
            export interface $200 {
                facility: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    VAT: boolean;
                    published: boolean;
                    commissionSale: boolean;
                    note: string | null;
                    latitude: number; // float
                    longitude: number; // float
                    zoom: number;
                    facilityCategoryOur: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7; // float
                    facilityCategoryOfficial: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5; // float
                    maxInfantAge: number;
                    destination: {
                        id: number;
                        name: string;
                    } | null;
                    facilityType: {
                        id: number;
                        name: string;
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1FacilitiesFacilityIdFacilityPropertyCategories {
        namespace Parameters {
            export type FacilityID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
        }
        namespace Responses {
            export interface $200 {
                facilityPropertyCategories: {
                    key: "BASE" | "LOCATION" | "BEACHES" | "DESCRIPTION" | "SPORT" | "ACCOMMODATION" | "MEAL_PLANS";
                    facilityProperties: {
                        id: number;
                        name: string;
                        type: "BOOLEAN" | "NUMBER" | "TEXT";
                        value: string | number /* float */ | boolean;
                        valueLocalization: {
                            languageCode: string;
                            webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                            value: string | null;
                        }[];
                    }[];
                    mealPlans: {
                        id: number;
                        name: string;
                    }[];
                    textLocalization?: {
                        languageCode: string;
                        webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string;
                    }[];
                }[];
            }
        }
    }
    namespace GetApiV1FacilitiesFacilityIdGallery {
        namespace Parameters {
            export type FacilityID = number;
            export type WebProject = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
        }
        export interface QueryParameters {
            webProject?: Parameters.WebProject;
        }
        namespace Responses {
            export interface $200 {
                facility: {
                    id: number;
                    gallery: {
                        [key: string]: any;
                    };
                };
            }
        }
    }
    namespace GetApiV1FacilitiesFacilityIdUnitTemplates {
        namespace Parameters {
            export type FacilityID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
        }
        namespace Responses {
            export interface $200 {
                facilityUnitTemplates: {
                    order: number;
                    unitTemplate: {
                        id: number;
                        name: string;
                        description: string;
                        type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                        code: string;
                        fixedCount: number;
                        extraBedCount: number;
                        withoutBedCount: number;
                        minimumPersonCount: number;
                        unitTemplateProperty: {
                            id: number;
                            name: string;
                        } | null;
                    };
                }[];
            }
        }
    }
    namespace GetApiV1FileTagFiles {
        namespace Parameters {
            export type FileID = number;
            export type TagID = number;
        }
        export interface QueryParameters {
            fileID?: Parameters.FileID;
            tagID?: Parameters.TagID;
        }
        namespace Responses {
            export type $200 = {
                tag: {
                    id: number; // float
                    tag: string;
                    fileTagFiles: {
                        fileID?: number; // float
                    }[];
                };
            } | {
                fileTagFiles: {
                    fileID: number; // float
                    fileTagID: number; // float
                    fileTag: {
                        tag: string;
                    };
                }[];
            };
        }
    }
    namespace GetApiV1FileTags {
        namespace Parameters {
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
        }
        namespace Responses {
            export interface $200 {
                fileTags: {
                    id: number;
                    tag: string;
                }[];
            }
        }
    }
    namespace GetApiV1FilesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                file: {
                    id: number;
                    displayName: string;
                    dataType: "PDF" | "IMAGE" | "DOC" | "EXCEL" | "ZIP" | "RAR" | "OTHER";
                    path: string;
                    pathFileName: string;
                    size: number;
                    title: string | null;
                    altText: string | null;
                    description: string | null;
                    mimeType: string;
                    fileTags: {
                        id: number;
                        tag: string;
                        fileTagFile: {
                            fileID: number;
                            fileTagID: number;
                        };
                    }[];
                };
            }
        }
    }
    namespace GetApiV1FilesIdDownload {
        namespace Parameters {
            export type Id = number;
            export type T = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            t?: Parameters.T;
        }
    }
    namespace GetApiV1Folders {
        namespace Parameters {
            export type PathToFolder = string;
        }
        export interface QueryParameters {
            pathToFolder: Parameters.PathToFolder;
        }
    }
    namespace GetApiV1FoldersContent {
        namespace Parameters {
            export type FileLimit = 25 | 50 | 100;
            export type FilePage = number;
            export type FileType = "PDF" | "IMAGE" | "DOC" | "EXCEL" | "ZIP" | "RAR" | "OTHER";
            export type FolderLimit = 25 | 50 | 100;
            export type FolderPage = number;
            export type Path = string;
            export type Search = string | null;
        }
        export interface QueryParameters {
            path: Parameters.Path;
            fileType?: Parameters.FileType;
            search?: Parameters.Search;
            folderLimit?: Parameters.FolderLimit;
            folderPage?: Parameters.FolderPage;
            fileLimit?: Parameters.FileLimit;
            filePage?: Parameters.FilePage;
        }
        namespace Responses {
            export interface $200 {
                folders: {
                    items: {
                        name: string;
                        path: string;
                    }[];
                    pagination: {
                        limit: number;
                        page: number;
                        totalPages: number;
                        totalCount: number;
                    };
                };
                files: {
                    items: {
                        id: number;
                        name: string;
                        displayName: string;
                        path: string;
                        size: number; // float
                        type: "PDF" | "IMAGE" | "DOC" | "EXCEL" | "ZIP" | "RAR" | "OTHER";
                    }[];
                    pagination: {
                        limit: number;
                        page: number;
                        totalPages: number;
                        totalCount: number;
                    };
                };
            }
        }
    }
    namespace GetApiV1FoldersContentFiltered {
        namespace Parameters {
            export type FileLimit = 25 | 50 | 100;
            export type FilePage = number;
            export type FileType = "PDF" | "IMAGE" | "DOC" | "EXCEL" | "ZIP" | "RAR" | "OTHER";
            export type FolderLimit = 25 | 50 | 100;
            export type FolderPage = number;
            export type Path = string;
            export type Search = string | null;
        }
        export interface QueryParameters {
            path: Parameters.Path;
            fileType?: Parameters.FileType;
            search?: Parameters.Search;
            folderLimit?: Parameters.FolderLimit;
            folderPage?: Parameters.FolderPage;
            fileLimit?: Parameters.FileLimit;
            filePage?: Parameters.FilePage;
        }
        namespace Responses {
            export interface $200 {
                folders: {
                    items: {
                        name: string;
                        path: string;
                    }[];
                    pagination: {
                        limit: number;
                        page: number;
                        totalPages: number;
                        totalCount: number;
                    };
                };
                files: {
                    items: {
                        id: number;
                        name: string;
                        displayName: string;
                        path: string;
                        size: number; // float
                        type: "PDF" | "IMAGE" | "DOC" | "EXCEL" | "ZIP" | "RAR" | "OTHER";
                    }[];
                    pagination: {
                        limit: number;
                        page: number;
                        totalPages: number;
                        totalCount: number;
                    };
                };
            }
        }
    }
    namespace GetApiV1Insurances {
        namespace Parameters {
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
                insurances: {
                    id: number;
                    name: string;
                    personPrice: number; // float
                    currency: {
                        code: string;
                        sign: string;
                    };
                    personType: {
                        id: number;
                        name: string;
                    };
                }[];
            }
        }
    }
    namespace GetApiV1InsurancesInsuranceId {
        namespace Parameters {
            export type InsuranceID = number;
        }
        export interface PathParameters {
            insuranceID: Parameters.InsuranceID;
        }
        namespace Responses {
            export interface $200 {
                insurance: {
                    id: number;
                    name: string;
                    description: string;
                    insuranceContractNumber: string;
                    personPrice: number; // float
                    currency: {
                        code: string;
                        sign: string;
                    };
                    insuranceCompany: {
                        id: number;
                        name: string;
                    };
                    personType: {
                        id: number;
                        name: string;
                    };
                    file: {
                        id: number;
                        name: string;
                        path: string;
                    };
                };
            }
        }
    }
    namespace GetApiV1Lines {
        namespace Parameters {
            export type Direction = "FORTH" | "BACK" | "BACK_AND_FORTH";
            export type LastStationID = number;
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type RoadDepartureDateFrom = string; // date-time
            export type RoadDepartureDateTo = string; // date-time
            export type Search = string | null;
            export type SearchLineOnly = string;
            export type StationID = number;
            export type Type = "AIR" | "BUS";
        }
        export interface QueryParameters {
            type: Parameters.Type;
            roadDepartureDateFrom?: Parameters.RoadDepartureDateFrom /* date-time */;
            roadDepartureDateTo?: Parameters.RoadDepartureDateTo /* date-time */;
            direction?: Parameters.Direction;
            stationID?: Parameters.StationID;
            lastStationID?: Parameters.LastStationID;
            search?: Parameters.Search;
            searchLineOnly?: Parameters.SearchLineOnly;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                lines: {
                    id: number;
                    code: string;
                    direction: "FORTH" | "BACK";
                    carrier: {
                        id: number;
                        name: string;
                    };
                    stations: {
                        id: number;
                        code: string;
                        destination: {
                            id: number;
                            name: string;
                        };
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
    namespace GetApiV1LinesLineId {
        namespace Parameters {
            export type LineID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
        }
        namespace Responses {
            export interface $200 {
                line: {
                    id: number;
                    type: "AIR" | "BUS";
                    code: string;
                    direction: "FORTH" | "BACK";
                    connectionType: "CHARTER" | "REGULAR";
                    collection: boolean;
                    note: string | null;
                    carrier: {
                        id: number;
                        name: string;
                    };
                };
            }
        }
    }
    namespace GetApiV1LinesLineIdRoads {
        namespace Parameters {
            export type ArrivalDateFrom = string; // date-time
            export type ArrivalDateTo = string; // date-time
            export type DepartureDateFrom = string; // date-time
            export type DepartureDateTo = string; // date-time
            export type Limit = 25 | 50 | 100;
            export type LineID = number;
            export type Order = string;
            export type Page = number;
            export type Search = string | null;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
        }
        export interface QueryParameters {
            arrivalDateFrom?: Parameters.ArrivalDateFrom /* date-time */;
            arrivalDateTo?: Parameters.ArrivalDateTo /* date-time */;
            departureDateFrom?: Parameters.DepartureDateFrom /* date-time */;
            departureDateTo?: Parameters.DepartureDateTo /* date-time */;
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                roads: {
                    id: number;
                    code: string | null;
                    departureDatetime: string; // date-time
                    arrivalDatetime: string; // date-time
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
    namespace GetApiV1LinesLineIdStations {
        namespace Parameters {
            export type LineID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
        }
        namespace Responses {
            export interface $200 {
                lineStations: {
                    order: number;
                    priceLevel: number | null; // float
                    timeShift: null | number;
                    station: {
                        id: number;
                        name: string;
                        code: string;
                        description: string | null;
                        timezone: string | null;
                        type: "AIR" | "BUS";
                        destination: {
                            id: number;
                            name: string;
                        } | null;
                    };
                }[];
            }
        }
    }
    namespace GetApiV1LinesLineIdStationsUnassigned {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type LineID = number;
            export type Page = number;
            export type Search = string | null;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                unassignedStations: {
                    id: number;
                    code: string;
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
    namespace GetApiV1LinesLineIdTermsTermIdStations {
        namespace Parameters {
            export type LineID = number;
            export type SendDefaultIfEmpty = boolean;
            export type TermID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            termID: Parameters.TermID;
        }
        export interface QueryParameters {
            sendDefaultIfEmpty?: Parameters.SendDefaultIfEmpty;
        }
        namespace Responses {
            export interface $200 {
                lineTermStations: {
                    order: number;
                    priceLevel: number | null; // float
                    timeShift: null | number;
                    station: {
                        id: number;
                        name: string;
                        code: string;
                        description: string | null;
                        timezone: string | null;
                        type: "AIR" | "BUS";
                        destination: {
                            id: number;
                            name: string;
                        } | null;
                    };
                }[];
                hasTermStations: boolean;
            }
        }
    }
    namespace GetApiV1LinesLineIdTermsTermIdStationsUnassigned {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type LineID = number;
            export type Page = number;
            export type Search = string | null;
            export type TermID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            termID: Parameters.TermID;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                unassignedStations: {
                    id: number;
                    code: string;
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
    namespace GetApiV1LinesLineIdTermsTermIdStationsWithDatetimes {
        namespace Parameters {
            export type LineID = number;
            export type ServiceID = number;
            export type TermID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            termID: Parameters.TermID;
        }
        export interface QueryParameters {
            serviceID: Parameters.ServiceID;
        }
        namespace Responses {
            export interface $200 {
                lineTermStations: {
                    order: number;
                    datetime: string; // date-time
                    station: {
                        id: number;
                        code: string;
                    };
                }[];
            }
        }
    }
    namespace GetApiV1LinesLineIdTermsWithTermStations {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type LineID = number;
            export type Page = number;
            export type Search = string | null;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                terms: {
                    id: number;
                    code: string;
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
    namespace GetApiV1LinesLineIdTextItems {
        namespace Parameters {
            export type LineID = number;
            export type TextTemplateID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
        }
        export interface QueryParameters {
            textTemplateID: Parameters.TextTemplateID;
            webProjectCode: Parameters.WebProjectCode;
        }
        namespace Responses {
            export interface $200 {
                textItems: {
                    id: number;
                    name: string;
                    xmlName: string;
                    maxLength: number;
                    lineTextItems: {
                        textItemID: number;
                        localization: {
                            id: number;
                            values: {
                                languageCode: string;
                                value: string | null;
                            }[];
                        };
                    }[];
                }[];
            }
        }
    }
    namespace GetApiV1LinesLineIdUnitTemplates {
        namespace Parameters {
            export type LineID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
        }
        namespace Responses {
            export interface $200 {
                lineUnitTemplates: {
                    order: number;
                    unitTemplate: {
                        id: number;
                        name: string;
                        description: string;
                        type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                        code: string;
                        fixedCount: number;
                        extraBedCount: number;
                        withoutBedCount: number;
                        minimumPersonCount: number;
                        unitTemplateProperty: {
                            id: number;
                            name: string;
                        } | null;
                    };
                }[];
            }
        }
    }
    namespace GetApiV1LinesRoadsRoadId {
        namespace Parameters {
            export type RoadID = number;
        }
        export interface PathParameters {
            roadID: Parameters.RoadID;
        }
        namespace Responses {
            export interface $200 {
                road: {
                    id: number;
                    code: string | null;
                    maxLuggageWeight: null | number;
                    meetupBefore: null | number;
                    departureDatetime: string; // date-time
                    arrivalDatetime: string; // date-time
                    line: {
                        id: number;
                        code: string;
                    };
                };
            }
        }
    }
    namespace GetApiV1OrganizationBranchesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                organizationBranch: {
                    id: number;
                    code: string | null;
                    name: string | null;
                    phone: string | null;
                    email: string | null;
                    fax: string | null;
                    addresses: [
                        {
                            id: number;
                            street: string | null;
                            streetNumber: string | null;
                            orientationNumber: string | null;
                            description: string | null;
                            zip: string | null;
                            city: string;
                            pobox: string | null;
                            country: {
                                id: number;
                                name: string;
                            };
                            types: ("CORRESPONDENCE" | "PRESENTATION" | "BILLING" | "ORGANIZATION")[];
                        },
                        ...{
                            id: number;
                            street: string | null;
                            streetNumber: string | null;
                            orientationNumber: string | null;
                            description: string | null;
                            zip: string | null;
                            city: string;
                            pobox: string | null;
                            country: {
                                id: number;
                                name: string;
                            };
                            types: ("CORRESPONDENCE" | "PRESENTATION" | "BILLING" | "ORGANIZATION")[];
                        }[]
                    ];
                    organization: {
                        id: number;
                        name: string;
                    };
                };
            }
        }
    }
    namespace GetApiV1Organizations {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type Page = number;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                organizations: {
                    id: number;
                    name: string;
                    companyBranch?: {
                        id: number;
                        name: string;
                    };
                    address: {
                        id: number;
                        street: string | null;
                        streetNumber: string | null;
                        orientationNumber: string | null;
                        description: string | null;
                        zip: string | null;
                        city: string;
                        pobox: string | null;
                        country: {
                            id: number;
                            name: string;
                        };
                    } | null;
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
    namespace GetApiV1OrganizationsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                organization: {
                    id: number;
                    name: string;
                    businessID: string | null;
                    taxID: string | null;
                    vatID: string | null;
                    isVATPayer: boolean;
                    web: string | null;
                    phone: string | null;
                    email: string | null;
                    fax: string | null;
                    companyBranch?: {
                        id: number;
                        name: string;
                    };
                    address: {
                        id: number;
                        street: string | null;
                        streetNumber: string | null;
                        orientationNumber: string | null;
                        description: string | null;
                        zip: string | null;
                        city: string;
                        pobox: string | null;
                        country: {
                            id: number;
                            name: string;
                        };
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1OrganizationsIdOrganizationBranches {
        namespace Parameters {
            export type Id = number;
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type Search = string | null;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            order?: Parameters.Order;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                organizationBranches: {
                    id: number;
                    code: string | null;
                    name: string | null;
                    addresses: {
                        id: number;
                        street: string | null;
                        streetNumber: string | null;
                        orientationNumber: string | null;
                        description: string | null;
                        zip: string | null;
                        city: string;
                        pobox: string | null;
                        country: {
                            id: number;
                            name: string;
                        } | null;
                        type: "CORRESPONDENCE" | "PRESENTATION" | "BILLING" | "ORGANIZATION";
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
    namespace GetApiV1Payments {
        namespace Parameters {
            export type AmountBiggerThan = number; // float
            export type AmountLesserThan = number; // float
            export type Limit = 25 | 50 | 100;
            export type Page = number;
            export type PaymentStatus = "all" | "paired" | "unpaired";
            export type ReceivedAt = string; // date-time
            export type Search = string | null;
            export type VariableSymbol = string;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            amountBiggerThan?: Parameters.AmountBiggerThan /* float */;
            amountLesserThan?: Parameters.AmountLesserThan /* float */;
            receivedAt?: Parameters.ReceivedAt /* date-time */;
            paymentStatus?: Parameters.PaymentStatus;
            variableSymbol?: Parameters.VariableSymbol;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                payments: {
                    id: number;
                    iban: string; // ^[a-zA-Z0-9]*$
                    variableSymbol: string;
                    specificSymbol: string | null;
                    constantSymbol: string | null;
                    swift: string /* ^[a-zA-Z0-9]*$ */ | string /* ^[a-zA-Z0-9]*$ */;
                    amount: number; // float
                    receivedAt: string; // date-time
                    note: string | null;
                    businessCase: {
                        id: number; // float
                        travelerNames: {
                            name: string;
                            surname: string;
                        }[];
                    } | null;
                    createdAt: string; // date-time
                    updatedAt: string | null; // date-time
                    deletedAt: string | null; // date-time
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
    namespace GetApiV1PaymentsPaymentId {
        namespace Parameters {
            export type PaymentID = number;
        }
        export interface PathParameters {
            paymentID: Parameters.PaymentID;
        }
        namespace Responses {
            export interface $200 {
                payment: {
                    id: number;
                    iban: string; // ^[a-zA-Z0-9]*$
                    variableSymbol: string;
                    specificSymbol: string | null;
                    constantSymbol: string | null;
                    swift: string /* ^[a-zA-Z0-9]*$ */ | string /* ^[a-zA-Z0-9]*$ */;
                    amount: number; // float
                    receivedAt: string; // date-time
                    note: string | null;
                    businessCase: {
                        id: number; // float
                        travelerNames?: {
                            name: string;
                            surname: string;
                        }[];
                    } | null;
                    createdAt: string; // date-time
                    updatedAt: string | null; // date-time
                    deletedAt: string | null; // date-time
                };
            }
        }
    }
    namespace GetApiV1PaymentsPaymentIdLogs {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type Page = number;
            export type PaymentID = number;
        }
        export interface PathParameters {
            paymentID: Parameters.PaymentID;
        }
        export interface QueryParameters {
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                paymentLogs: {
                    userName: string;
                    createdAt: string; // date-time
                    oldValue: {
                        id: number;
                        iban: string; // ^[a-zA-Z0-9]*$
                        variableSymbol: string;
                        specificSymbol: string | null;
                        constantSymbol: string | null;
                        swift: string /* ^[a-zA-Z0-9]*$ */ | string /* ^[a-zA-Z0-9]*$ */;
                        amount: number; // float
                        receivedAt: string; // date-time
                        note: string | null;
                        businessCaseID: number | null; // float
                        createdAt: string; // date-time
                        createdBy: number;
                        updatedAt: string | null; // date-time
                        updatedBy: null | number;
                        deletedAt: string | null; // date-time
                        deletedBy: null | number;
                    } | null;
                    newValue: {
                        id: number;
                        iban: string; // ^[a-zA-Z0-9]*$
                        variableSymbol: string;
                        specificSymbol: string | null;
                        constantSymbol: string | null;
                        swift: string /* ^[a-zA-Z0-9]*$ */ | string /* ^[a-zA-Z0-9]*$ */;
                        amount: number; // float
                        receivedAt: string; // date-time
                        note: string | null;
                        businessCaseID: number | null; // float
                        createdAt: string; // date-time
                        createdBy: number;
                        updatedAt: string | null; // date-time
                        updatedBy: null | number;
                        deletedAt: string | null; // date-time
                        deletedBy: null | number;
                    } | null;
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
    namespace GetApiV1People {
        namespace Parameters {
            export type AgeFrom = number;
            export type AgeTo = number;
            export type CompareDate = string; // date-time
            export type Limit = 25 | 50 | 100;
            export type Page = number;
            export type Search = string | null;
        }
        export interface QueryParameters {
            ageFrom?: Parameters.AgeFrom;
            ageTo?: Parameters.AgeTo;
            compareDate?: Parameters.CompareDate /* date-time */;
            search?: Parameters.Search;
            limit?: Parameters.Limit;
            page?: Parameters.Page;
        }
        namespace Responses {
            export interface $200 {
                people: {
                    id: number;
                    name: string;
                    surname: string;
                    birthdate: string; // date-time
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
    namespace GetApiV1PeoplePersonId {
        namespace Parameters {
            export type PersonID = number;
        }
        export interface PathParameters {
            personID: Parameters.PersonID;
        }
        namespace Responses {
            export interface $200 {
                person: {
                    id: number;
                    title: string | null;
                    name: string;
                    surname: string;
                    gender?: "MALE" | "FEMALE";
                    birthdate: string; // date-time
                    phone: string | null;
                    email: string | null; // email
                    traveler: {
                        id: number;
                        order: number;
                        isContact: boolean;
                        passport: string | null;
                        passportValidTo: string | null; // date-time
                    } | null;
                    address: {
                        id: number;
                        street: string | null;
                        streetNumber: string | null;
                        orientationNumber: string | null;
                        description: string | null;
                        zip: string | null;
                        city: string;
                        pobox: string | null;
                        country: {
                            id: number;
                            name: string;
                        };
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1Permissions {
        namespace Responses {
            export interface $200 {
                permissions: {
                    id: number;
                    key: "SUPER_ADMIN" | "ADMIN" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "USER_LIST" | "ENUMS_DEFINITION" | "DESTINATION_EDIT" | "DESTINATION_BROWSING" | "FACILITY_BROWSING" | "FACILITY_EDIT" | "FILES_EDIT" | "SALES" | "TRANSPORTATION_BROWSING" | "TRANSPORTATION_EDIT" | "TERM_BROWSING" | "TERM_EDIT" | "PRODUCT_BROWSING" | "PRODUCT_EDIT" | "COMPANIES_BROWSING" | "COMPANIES_EDIT" | "ORGANIZATIONS_EDIT" | "ORGANIZATIONS_BROWSING" | "RECORD_ID_SHOW" | "BUSINESS_CASES_BROWSING" | "BUSINESS_CASES_CREATE" | "BUSINESS_CASES_EDIT" | "BUSINESS_CASES_DELETE" | "CUSTOMERS_BROWSING" | "DISCOUNT_BROWSING" | "DISCOUNT_EDIT" | "INSURANCE_BROWSING" | "INSURANCE_EDIT" | "PAYMENTS_EDIT" | "PAYMENTS_BROWSING" | "COMMISSION_EDIT" | "COMMISSION_BROWSING";
                    displayName: string;
                    groupKey: "SUPER_ADMIN" | "ADMIN" | "USERS" | "ENUMS" | "INVENTORY" | "DESTINATION" | "FACILITIES" | "FILES" | "TRANSPORTATION" | "TERMS" | "SALES" | "PRODUCTS" | "COMPANIES" | "RECORDS" | "BUSINESS_CASES" | "CUSTOMERS" | "DISCOUNT" | "INSURANCES" | "PAYMENTS" | "COMMISIONS";
                    groupDisplayName: string;
                }[];
            }
        }
    }
    namespace GetApiV1Products {
        namespace Parameters {
            export type DestinationIDs = number[];
            export type FacilityIDs = number[];
            export type Page = number;
            export type Rooms = {
                count: number;
                occupancy: {
                    ADULT: {
                        count: number;
                    };
                    CHILD: {
                        count: number;
                        ages?: [
                        ] | [
                        ];
                    };
                };
            }[];
            export type StationIDs = number[];
            export interface Term {
                dateFrom: string; // date-time
                dateTo: string; // date-time
            }
            export type TermIDs = number[];
            export type TermSerialIDs = number[];
        }
        export interface QueryParameters {
            destinationIDs?: Parameters.DestinationIDs;
            termSerialIDs?: Parameters.TermSerialIDs;
            termIDs?: Parameters.TermIDs;
            facilityIDs?: Parameters.FacilityIDs;
            term: Parameters.Term;
            stationIDs?: Parameters.StationIDs;
            rooms: Parameters.Rooms;
            page?: Parameters.Page;
        }
    }
    namespace GetApiV1ProductsAvailableStations {
        namespace Parameters {
            export type PersonTypeID = number;
            export type ServiceUnitTemplateID = number;
            export type TermID = number;
        }
        export interface QueryParameters {
            termID: Parameters.TermID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            personTypeID?: Parameters.PersonTypeID;
        }
    }
    namespace GetApiV1ProductsDestinations {
        namespace Parameters {
            export type Search = string | null;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
        }
        namespace Responses {
            export interface $200 {
                destinations: {
                    id: number;
                    name: string;
                    country: {
                        id: number;
                        isoCode: string | null;
                    } | null;
                }[];
                termSerials: {
                    id: number;
                    name: string;
                    termPrefix: string;
                }[];
                terms: {
                    id: number;
                    code: string;
                }[];
                facilities: {
                    id: number;
                    name: string;
                }[];
            }
        }
    }
    namespace GetApiV1ProductsPersonType {
        namespace Parameters {
            export type Birthdate = string; // date-time
        }
        export interface QueryParameters {
            birthdate: Parameters.Birthdate /* date-time */;
        }
        namespace Responses {
            export interface $200 {
                age: number;
                personType: {
                    id: number;
                    name: string;
                    ageFrom: number;
                    ageTo: number;
                };
            }
        }
    }
    namespace GetApiV1ProductsStations {
        namespace Parameters {
            export type DestinationIDs = number[];
            export type FacilityIDs = number[];
            export type Search = string | null;
            export interface Term {
                dateFrom: string; // date-time
                dateTo: string; // date-time
            }
            export type TermIDs = number[];
            export type TermSerialIDs = number[];
        }
        export interface QueryParameters {
            search?: Parameters.Search;
            destinationIDs?: Parameters.DestinationIDs;
            facilityIDs?: Parameters.FacilityIDs;
            termSerialIDs?: Parameters.TermSerialIDs;
            termIDs?: Parameters.TermIDs;
            term?: Parameters.Term;
        }
        namespace Responses {
            export interface $200 {
                stations: {
                    id: number;
                    label: string;
                    type: "AIR" | "BUS";
                }[];
                individual?: {
                    label: string;
                };
            }
        }
    }
    namespace GetApiV1Roles {
        namespace Responses {
            export interface $200 {
                roles: {
                    id: number;
                    name: string;
                    userCount: number;
                }[];
            }
        }
    }
    namespace GetApiV1RolesRoleId {
        namespace Parameters {
            export type RoleID = number;
        }
        export interface PathParameters {
            roleID: Parameters.RoleID;
        }
        namespace Responses {
            export interface $200 {
                role: {
                    id: number;
                    name: string;
                    users: {
                        id: number;
                        fullName: string;
                    }[];
                    permissions: {
                        id: number;
                        key: "SUPER_ADMIN" | "ADMIN" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "USER_LIST" | "ENUMS_DEFINITION" | "DESTINATION_EDIT" | "DESTINATION_BROWSING" | "FACILITY_BROWSING" | "FACILITY_EDIT" | "FILES_EDIT" | "SALES" | "TRANSPORTATION_BROWSING" | "TRANSPORTATION_EDIT" | "TERM_BROWSING" | "TERM_EDIT" | "PRODUCT_BROWSING" | "PRODUCT_EDIT" | "COMPANIES_BROWSING" | "COMPANIES_EDIT" | "ORGANIZATIONS_EDIT" | "ORGANIZATIONS_BROWSING" | "RECORD_ID_SHOW" | "BUSINESS_CASES_BROWSING" | "BUSINESS_CASES_CREATE" | "BUSINESS_CASES_EDIT" | "BUSINESS_CASES_DELETE" | "CUSTOMERS_BROWSING" | "DISCOUNT_BROWSING" | "DISCOUNT_EDIT" | "INSURANCE_BROWSING" | "INSURANCE_EDIT" | "PAYMENTS_EDIT" | "PAYMENTS_BROWSING" | "COMMISSION_EDIT" | "COMMISSION_BROWSING";
                        displayName: string;
                    }[];
                };
            }
        }
    }
    namespace GetApiV1RolesRoleIdAvailableUsers {
        namespace Parameters {
            export type RoleID = number;
            export type Search = string | null;
        }
        export interface PathParameters {
            roleID: Parameters.RoleID;
        }
        export interface QueryParameters {
            search?: Parameters.Search;
        }
        namespace Responses {
            export interface $200 {
                users: {
                    id: number;
                    fullName: string;
                }[];
            }
        }
    }
    namespace GetApiV1ServicesServiceId {
        namespace Parameters {
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
                    type: "TRANSPORTATION" | "FACILITY";
                    ownership: "PURCHASED" | "OWN";
                    webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                    offerForSale: boolean;
                    offerForCalculation: boolean;
                    offerForTransportSale: boolean;
                    offerFrom: string | null; // date-time
                    offerTo: string | null; // date-time
                    published: boolean;
                    hidePrices: boolean;
                    serviceUnitTemplates: {
                        id: number;
                        lineID: number;
                        unitTemplate: {
                            id: number;
                            name: string;
                        } | null;
                    }[];
                    vatRate: {
                        id: number;
                        name: string;
                    } | null;
                    termSerial: {
                        id: number;
                        name: string;
                        terms: {
                            id: number;
                            code: string;
                            roads: {
                                id: number;
                                code: string | null;
                                maxLuggageWeight: null | number;
                                meetupBefore: null | number;
                                departureDatetime: string; // date-time
                                arrivalDatetime: string; // date-time
                                line: {
                                    id: number;
                                    code: string;
                                    direction: "FORTH" | "BACK";
                                };
                            }[];
                            hasTermStations: {
                                [key: string]: any;
                            };
                        }[];
                    } | null;
                    lineForth: {
                        id: number;
                        code: string;
                        type: "AIR" | "BUS";
                        roadsCount: number;
                    };
                    lineBack: {
                        id: number;
                        code: string;
                        type: "AIR" | "BUS";
                        roadsCount: number;
                    };
                    facility: {
                        id: number;
                        name: string;
                    };
                };
                messages: {
                    message: string;
                    type: "WARNING";
                }[];
            }
        }
    }
    namespace GetApiV1ServicesServiceIdAvailableTermNights {
        namespace Parameters {
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        namespace Responses {
            export interface $200 {
                availableTermNights: number[];
            }
        }
    }
    namespace GetApiV1ServicesServiceIdGallery {
        namespace Parameters {
            export type ServiceID = number;
            export type WebProject = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        export interface QueryParameters {
            webProject?: Parameters.WebProject;
        }
        namespace Responses {
            export interface $200 {
                service: {
                    id: number;
                    gallery: {
                        [key: string]: any;
                    };
                };
            }
        }
    }
    namespace GetApiV1ServicesServiceIdMealPlans {
        namespace Parameters {
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        namespace Responses {
            export interface $200 {
                standardMealPlans: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        id: number;
                    };
                }[];
                premiumMealPlans: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        id: number;
                    };
                }[];
            }
        }
    }
    namespace GetApiV1ServicesServiceIdTextItems {
        namespace Parameters {
            export type ServiceID = number;
            export type TextTemplateID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        export interface QueryParameters {
            textTemplateID: Parameters.TextTemplateID;
            webProjectCode: Parameters.WebProjectCode;
        }
        namespace Responses {
            export interface $200 {
                textItems?: {
                    id: number;
                    name: string;
                    xmlName: string;
                    maxLength: number;
                    serviceTextItems: {
                        textItemID: number;
                        localization?: {
                            id: number;
                            values: {
                                languageCode: string;
                                value: string | null;
                            }[];
                        };
                    }[];
                }[];
            }
        }
    }
    namespace GetApiV1ServicesServiceIdUnitTemplates {
        namespace Parameters {
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        namespace Responses {
            export interface $200 {
                serviceUnitTemplates: {
                    id: number;
                    groupID: string; // uuid
                    line: {
                        id: number;
                        code: string;
                        type: "AIR" | "BUS";
                        direction: "FORTH" | "BACK";
                    } | null;
                    unitTemplate: {
                        id: number;
                        name: string;
                        type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                        code: string;
                        unitTemplateProperty: {
                            id: number;
                            name: string;
                        } | null;
                    };
                    individualUnitTemplate: {
                        id: number;
                        name: string;
                        type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                        code: string;
                        unitTemplateProperty: {
                            id: number;
                            name: string;
                        } | null;
                    };
                    termsData: {
                        capacity: null | number;
                        note: string | null;
                        termID: number;
                    }[];
                    servicePricelistItems: {
                        id: number;
                        type: "FIXED_PRICE" | "PERCENT_REFERENCE" | "PERCENT_REFERENCE_DISCOUNT" | "SURCHARGE_COSTS_PERCENT" | "SURCHARGE_TERM" | "SURCHARGE_PERCENT_WITH_FIXED_PRICE";
                        reference: boolean;
                        pricelistItem: {
                            id: number;
                            name: string;
                        };
                        individualPricelistItem: {
                            id: number;
                            name: string;
                        };
                        pricelistItemTerms: {
                            price: number | null; // float
                            overriden: boolean;
                            calculationFixedSurcharge: number | null; // float
                            calculationPercent: number | null; // float
                            cost: {
                                value: number | null; // float
                                errorMessage: string | null;
                            };
                            margin: string | null;
                            surcharge: string | null;
                            termID: number;
                        }[];
                    }[];
                }[];
                hasUnpublishedPrices: boolean;
                messages: {
                    message: string;
                    type: "WARNING";
                }[];
            }
        }
    }
    namespace GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId {
        namespace Parameters {
            export type IndividualUnitTemplateID = number;
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            individualUnitTemplateID: Parameters.IndividualUnitTemplateID;
        }
        namespace Responses {
            export interface $200 {
                individualUnitTemplate: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    description: string | null;
                    descriptionLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
                    code: string;
                    fixedCount: number;
                    extraBedCount: number;
                    withoutBedCount: number;
                    minimumPersonCount: number;
                    occupancyAlternatives: [
                        {
                            fixedPersonTypeIDs: number[];
                            extraBedPersonTypeIDs: number[];
                            withoutBedPersonTypeIDs: number[];
                        }
                    ] | [
                        {
                            fixedPersonTypeIDs: number[];
                            extraBedPersonTypeIDs: number[];
                            withoutBedPersonTypeIDs: number[];
                        }
                    ];
                    facilityType: string | null;
                    unitTemplateProperty: {
                        id: number;
                        name: string;
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsCostSeasonsReference {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
        }
        namespace Responses {
            export interface $200 {
                individualPricelistItem: {
                    id: number;
                    name: string;
                };
                costSeasons: {
                    id: number;
                    value: number; // float
                    validityAllTerms: boolean;
                    costSeasonItems: [
                    ] | [
                        {
                            id: number;
                            dateFrom: string; // date-time
                            dateTo: string; // date-time
                        },
                        ...{
                            id: number;
                            dateFrom: string; // date-time
                            dateTo: string; // date-time
                        }[]
                    ];
                }[];
            }
        }
    }
    namespace GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
            export type ServiceUnitTemplatePricelistItemID = number | string;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            serviceUnitTemplatePricelistItemID: Parameters.ServiceUnitTemplatePricelistItemID;
        }
        namespace Responses {
            export interface $200 {
                costSeasons: {
                    id: number;
                    value: number; // float
                    validityAllTerms: boolean;
                    costSeasonItems: [
                    ] | [
                        {
                            id: number;
                            dateFrom: string; // date-time
                            dateTo: string; // date-time
                        },
                        ...{
                            id: number;
                            dateFrom: string; // date-time
                            dateTo: string; // date-time
                        }[]
                    ];
                }[];
            }
        }
    }
    namespace GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId {
        namespace Parameters {
            export type IndividualPricelistItemID = number | string /* uuid */;
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
            export type ServiceUnitTemplatePricelistItemID = string;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            serviceUnitTemplatePricelistItemID: Parameters.ServiceUnitTemplatePricelistItemID;
            individualPricelistItemID: Parameters.IndividualPricelistItemID;
        }
        namespace Responses {
            export interface $200 {
                individualPricelistItem: {
                    id: number;
                    name: string;
                    nameLocalization: {
                        languageCode: string;
                        webProjectCode: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string | null;
                    }[];
                    extraBed: [
                        number
                    ] | [
                        ("OCCUPANCY_ALL_PERSONS_EXTRA_BED")
                    ] | null;
                    withoutBed: [
                        number
                    ] | [
                        ("OCCUPANCY_ALL_PERSONS_WITHOUT_BED")
                    ] | null;
                    usage: "FACILITY" | "TRANSPORTATION";
                    category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
                    timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
                    unitRelation: "PERSON" | "UNIT";
                    params: {
                        value: number;
                    } | null;
                    personTypes: {
                        id: number;
                        name: string;
                    }[];
                    mealPlan: {
                        id: number;
                        name: string;
                    } | null;
                };
            }
        }
    }
    namespace GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
        }
        namespace Responses {
            export interface $200 {
                terms: {
                    id: number;
                    discountValue: number | null; // float
                }[];
            }
        }
    }
    namespace GetApiV1TermSerials {
        namespace Responses {
            export interface $200 {
                termSerials: {
                    id: number;
                    name: string;
                    termPrefix: string;
                    destinationSeason: {
                        id: number;
                        name: string;
                    } | null;
                }[];
            }
        }
    }
    namespace GetApiV1TermSerialsDestinationSeasonsDestinationSeasonId {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type ServiceType = "TRANSPORTATION" | "FACILITY";
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        export interface QueryParameters {
            serviceType?: Parameters.ServiceType;
        }
        namespace Responses {
            export interface $200 {
                termSerials: {
                    id: number;
                    name: string;
                    termPrefix: string;
                    terms: {
                        id: number;
                        code: string;
                        dateFrom: string; // date-time
                        dateTo: string; // date-time
                    }[];
                    services: {
                        id: number;
                        name: string;
                        type: "TRANSPORTATION" | "FACILITY";
                        terms: {
                            id: number;
                            priceGroup: {
                                id: number;
                                color: string; // ^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
                                name: string;
                            };
                        }[];
                        forbiddenIndividualTransportTerms: {
                            id: number;
                        }[];
                    }[];
                }[];
            }
        }
    }
    namespace GetApiV1TermSerialsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
                termSerial: {
                    id: number;
                    name: string;
                    termPrefix: string;
                    destinationSeason: {
                        id: number;
                        name: string;
                        published: boolean;
                    };
                };
            }
        }
    }
    namespace GetApiV1TermSerialsTermSerialIdTerms {
        namespace Parameters {
            export type TermSerialID = number;
        }
        export interface PathParameters {
            termSerialID: Parameters.TermSerialID;
        }
        namespace Responses {
            export interface $200 {
                terms: {
                    id: number;
                    code: string;
                    startDay: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    dateFrom: string; // date-time
                    dateTo: string; // date-time
                }[];
            }
        }
    }
    namespace GetApiV1TermSerialsTerms {
        namespace Parameters {
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
                terms: {
                    id: number;
                    code: string;
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
    namespace GetApiV1Users {
        namespace Parameters {
            export type Limit = 25 | 50 | 100;
            export type Order = string;
            export type Page = number;
            export type RawActive = boolean;
            export type RoleID = number;
            export type Search = string | null;
            export type State = "ACTIVE" | "DELETED";
        }
        export interface QueryParameters {
            state?: Parameters.State;
            rawActive?: Parameters.RawActive;
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
                    fullName: string;
                    email: string;
                    confirmedAt: string | null; // date-time
                    deletedAt: string | null; // date-time
                    roles: {
                        id: number;
                        name: string;
                    }[];
                    permissions: {
                        id: number;
                        key: "SUPER_ADMIN" | "ADMIN" | "USER_CREATE" | "USER_EDIT" | "USER_DELETE" | "USER_LIST" | "ENUMS_DEFINITION" | "DESTINATION_EDIT" | "DESTINATION_BROWSING" | "FACILITY_BROWSING" | "FACILITY_EDIT" | "FILES_EDIT" | "SALES" | "TRANSPORTATION_BROWSING" | "TRANSPORTATION_EDIT" | "TERM_BROWSING" | "TERM_EDIT" | "PRODUCT_BROWSING" | "PRODUCT_EDIT" | "COMPANIES_BROWSING" | "COMPANIES_EDIT" | "ORGANIZATIONS_EDIT" | "ORGANIZATIONS_BROWSING" | "RECORD_ID_SHOW" | "BUSINESS_CASES_BROWSING" | "BUSINESS_CASES_CREATE" | "BUSINESS_CASES_EDIT" | "BUSINESS_CASES_DELETE" | "CUSTOMERS_BROWSING" | "DISCOUNT_BROWSING" | "DISCOUNT_EDIT" | "INSURANCE_BROWSING" | "INSURANCE_EDIT" | "PAYMENTS_EDIT" | "PAYMENTS_BROWSING" | "COMMISSION_EDIT" | "COMMISSION_BROWSING";
                        displayName: string;
                        isBasePermission: boolean;
                        roles: {
                            id: number;
                            name: string;
                        }[];
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
    namespace GetApiV1UsersSettings {
        namespace Responses {
            export interface $200 {
                userSetting: {
                    pagination: "PAGE_25" | "PAGE_50" | "PAGE_100";
                    productSearchFilters: ("NIGHTS_COUNT" | "HOTEL_CATEGORY" | "OCCUPANCY" | "PRICE_RANGE" | "MEAL_PLAN" | "BEACH_DISTANCE" | "PRICE_FLAG" | "DISCOUNT_AMOUNT")[] | null;
                } | null;
            }
        }
    }
    namespace GetApiV1UsersUserId {
        namespace Parameters {
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        namespace Responses {
            export interface $200 {
                user: {
                    id: number;
                    name: string | null;
                    surname: string | null;
                    email: string;
                    initials?: string;
                    confirmedAt: string | null; // date-time
                    lastLoginAt: string | null; // date-time
                    roles: {
                        id: number;
                        name: string;
                        permissions: {
                            id: number;
                            key: string;
                            displayName: string;
                            groupKey: string;
                            groupDisplayName: string;
                        }[];
                    }[];
                    permissions: {
                        id: number;
                        key: string;
                        displayName: string;
                        groupKey: string;
                        groupDisplayName: string;
                    }[];
                    companyBranches: {
                        id: number;
                        code: number;
                        name: string;
                        addresses: [
                            {
                                id: number;
                                street: string | null;
                                streetNumber: string | null;
                                orientationNumber: string | null;
                                description: string | null;
                                zip: string | null;
                                city: string;
                                pobox: string | null;
                                country: {
                                    id: number;
                                    name: string;
                                };
                                type: "ORGANIZATION";
                            }
                        ];
                        company: {
                            id: number;
                            name: string;
                        };
                    }[];
                    ipAddresses: {
                        id: number;
                        code: string;
                    }[];
                    creator: {
                        id: number;
                        fullName: string;
                    };
                    createdAt: string; // date-time
                    destructor: {
                        id: number;
                        fullName: string;
                    } | null;
                    deletedAt: string | null; // date-time
                };
            }
        }
    }
    namespace PatchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId {
        namespace Parameters {
            export type BusinessCaseID = number;
            export type TravelerID = number;
        }
        export interface PathParameters {
            businessCaseID: Parameters.BusinessCaseID;
            travelerID: Parameters.TravelerID;
        }
        export interface RequestBody {
            isContact: boolean;
            passport?: string | null;
            passportValidTo?: string | null; // date-time
            name: string;
            surname: string;
            birthdate: string; // date-time
            phone?: string | null;
            email?: string | null; // email
            address?: {
                street?: string | null;
                streetNumber: string;
                orientationNumber?: string | null;
                zip: string;
                city: string;
                countryID: number;
            } | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1CommisionsCommisionId {
        namespace Parameters {
            export type CommisionID = number;
        }
        export interface PathParameters {
            commisionID: Parameters.CommisionID;
        }
        export interface RequestBody {
            name: string;
            validFrom?: string | null; // date-time
            validTo?: string | null; // date-time
            value: number; // float
            companyIDs: number[];
            productTypeIDs?: number[];
            allowedDestinationIDs?: number[];
            allowedDestinationSeasonIDs?: number[];
            allowedFacilityIDs?: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1CompaniesCompanyId {
        namespace Parameters {
            export type CompanyID = number;
        }
        export interface PathParameters {
            companyID: Parameters.CompanyID;
        }
        export interface RequestBody {
            name: string;
            businessID?: string | null;
            taxID?: string | null;
            vatID?: string | null;
            isVATPayer: boolean;
            web?: string | null;
            phone?: string | null;
            email?: string | null; // email
            generalTermsAndConditionsUrl?: string | null;
            commercialRegisterEntry?: string | null;
            color: string; // ^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
            iban: string; // ^[a-zA-Z0-9]*$
            swift: string /* ^[a-zA-Z0-9]*$ */ | string /* ^[a-zA-Z0-9]*$ */;
            addresses: [
                {
                    street?: string | null;
                    streetNumber?: string | null;
                    orientationNumber?: string | null;
                    description?: string | null;
                    zip?: string | null;
                    city: string;
                    pobox?: string | null;
                    countryID: number;
                    types: ("ORGANIZATION")[];
                }
            ];
            stampFileID: number;
            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR";
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1CompanyBranchesCompanyBranchId {
        namespace Parameters {
            export type CompanyBranchID = number;
        }
        export interface PathParameters {
            companyBranchID: Parameters.CompanyBranchID;
        }
        export interface RequestBody {
            code: number;
            name?: string | null;
            phone?: string | null;
            email?: string | null; // email
            fax?: string | null;
            info?: string | null;
            openingHours?: [
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                }
            ] | null;
            addresses: [
                {
                    street?: string | null;
                    streetNumber?: string | null;
                    orientationNumber?: string | null;
                    description?: string | null;
                    zip?: string | null;
                    city: string;
                    pobox?: string | null;
                    countryID: number;
                    types: ("ORGANIZATION")[];
                }
            ];
            companyID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1DestinationSeasonsDestinationSeasonId {
        namespace Parameters {
            export type DestinationSeasonID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        export interface RequestBody {
            name: string;
            published: boolean;
            destinationID: number;
            seasonID: number;
            vatRateID?: null | number;
            productTypeIDs: number[];
            productCatalogueIDs: number[];
            webProjectCodes?: ("TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON")[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralInsuranceID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalInsuranceID: Parameters.GeneralInsuranceID;
        }
        export interface RequestBody {
            name: string;
            description: string;
            insuranceContractNumber: string;
            personPrice: number; // float
            insuranceID: number;
            currencyCode: string;
            insuranceCompanyID: number;
            personTypeID: number;
            fileID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralInsuranceID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalInsuranceID: Parameters.GeneralInsuranceID;
        }
        export interface RequestBody {
            costSeasons: {
                value: number; // float
                validityAllTerms: boolean;
                costSeasonItems: [
                ] | [
                    {
                        dateFrom: string; // date-time
                        dateTo: string; // date-time
                    },
                    ...{
                        dateFrom: string; // date-time
                        dateTo: string; // date-time
                    }[]
                ];
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralPricelistItemID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalPricelistItemID: Parameters.GeneralPricelistItemID;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            extraBed: [
                number
            ] | [
                ("OCCUPANCY_ALL_PERSONS_EXTRA_BED")
            ] | null;
            withoutBed: [
                number
            ] | [
                ("OCCUPANCY_ALL_PERSONS_WITHOUT_BED")
            ] | null;
            usage: "FACILITY" | "TRANSPORTATION";
            category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
            timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
            unitRelation: "PERSON" | "UNIT";
            params: {
                value: number;
            } | null;
            price: number; // float
            pricelistItemID: number;
            personTypeIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons {
        namespace Parameters {
            export type DestinationSeasonID = number;
            export type GeneralPricelistItemID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
            generalPricelistItemID: Parameters.GeneralPricelistItemID;
        }
        export interface RequestBody {
            costSeasons: {
                value: number; // float
                validityAllTerms: boolean;
                costSeasonItems: [
                ] | [
                    {
                        dateFrom: string; // date-time
                        dateTo: string; // date-time
                    },
                    ...{
                        dateFrom: string; // date-time
                        dateTo: string; // date-time
                    }[]
                ];
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1DestinationsDestinationId {
        namespace Parameters {
            export type DestinationID = number;
        }
        export interface PathParameters {
            destinationID: Parameters.DestinationID;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            latitude: number; // float
            longitude: number; // float
            zoom: number;
            timezone?: string | null;
            countryID?: null | number;
            parentID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1DestinationsDestinationIdGalleryReorderImagesFileId {
        namespace Parameters {
            export type DestinationID = number;
            export type FileID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            destinationID: Parameters.DestinationID;
            fileID: Parameters.FileID;
        }
        export interface QueryParameters {
            webProjectCode?: Parameters.WebProjectCode;
        }
        export interface RequestBody {
            orderIndex: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1DestinationsDestinationIdTextItemsTextItemId {
        namespace Parameters {
            export type DestinationID = number;
            export type LanguageCode = string;
            export type TextItemID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            destinationID: Parameters.DestinationID;
            textItemID: Parameters.TextItemID;
        }
        export interface QueryParameters {
            languageCode: Parameters.LanguageCode;
            webProjectCode: Parameters.WebProjectCode;
        }
        export interface RequestBody {
            value: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                updatedAt: string; // date-time
            }
        }
    }
    namespace PatchApiV1DiscountsDiscountId {
        namespace Parameters {
            export type DiscountID = number;
        }
        export interface PathParameters {
            discountID: Parameters.DiscountID;
        }
        export interface RequestBody {
            name: string;
            validFrom?: string | null; // date-time
            validTo?: string | null; // date-time
            type: "OLD_BUSINESS_CASE" | "NEW_BUSINESS_CASE" | "LIMIT_CAPACITY_UNIT_TEMPLATE" | "TRIP" | "CASHBACK";
            valueType: "PERCENT" | "FIX";
            value: number; // float
            applyCount: number;
            unitTemplateType: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
            transportationType: "AIR" | "BUS" | "INDIVIDUAL";
            discountMarkIDs?: number[];
            productTypeIDs?: number[];
            allowedDestinationIDs?: number[];
            allowedDestinationSeasonIDs?: number[];
            disallowedDestinationSeasonIDs?: number[];
            allowedFacilityIDs?: number[];
            allowedServiceUnitTemplateIDs?: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsCarriersCarrierId {
        namespace Parameters {
            export type CarrierID = number;
        }
        export interface PathParameters {
            carrierID: Parameters.CarrierID;
        }
        export interface RequestBody {
            name: string;
            businessID?: string | null;
            taxID?: string | null;
            vatID?: string | null;
            isVATPayer: boolean;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsCountriesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            isoCode?: string | null;
            vatRateID?: null | number;
            currencyCode?: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsCurrenciesCode {
        namespace Parameters {
            export type Code = string;
        }
        export interface PathParameters {
            code: Parameters.Code;
        }
        export interface RequestBody {
            code: string;
            sign: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsDepositAmountsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            percent: number; // float
            daysTillDepart: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsDiscountMarksDiscountMarkId {
        namespace Parameters {
            export type DiscountMarkID = number;
        }
        export interface PathParameters {
            discountMarkID: Parameters.DiscountMarkID;
        }
        export interface RequestBody {
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsExchangeRatesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            dateFrom: string; // date-time
            dateTo: string; // date-time
            currencyCodeFrom: string;
            currencyCodeTo: string;
            value: number; // float
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsFacilityTypesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId {
        namespace Parameters {
            export type InsuranceCompanyID = number;
        }
        export interface PathParameters {
            insuranceCompanyID: Parameters.InsuranceCompanyID;
        }
        export interface RequestBody {
            name: string;
            businessID: string;
            businessRegistration: string;
            taxID: string;
            vatID: string;
            web: string;
            email: string; // email
            infoLine: string;
            emergencyLine: string;
            address: {
                street: string;
                streetNumber: string;
                orientationNumber?: string | null;
                description?: string | null;
                zip: string;
                city: string;
                pobox?: string | null;
                countryID: number;
            };
            logoID: number;
            generalInsuranceConditionsID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsLanguagesCode {
        namespace Parameters {
            export type Code = string;
        }
        export interface PathParameters {
            code: Parameters.Code;
        }
        export interface RequestBody {
            code: string;
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsMealPlansId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            label: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsPersonTypesPersonTypeId {
        namespace Parameters {
            export type PersonTypeID = number;
        }
        export interface PathParameters {
            personTypeID: Parameters.PersonTypeID;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            ageFrom: number;
            ageTo: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsPersonTypesPersonTypeIdReorder {
        namespace Parameters {
            export type PersonTypeID = number;
        }
        export interface PathParameters {
            personTypeID: Parameters.PersonTypeID;
        }
        export interface RequestBody {
            order: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsPriceGroupsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            color: string; // ^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsPricelistItemsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            usage: "FACILITY" | "TRANSPORTATION";
            category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
            timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
            unitRelation: "PERSON" | "UNIT";
            params: {
                value: number;
            } | null;
            personTypeIDs: number[];
            mealPlanID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsProductCataloguesProductCatalogueId {
        namespace Parameters {
            export type ProductCatalogueID = number;
        }
        export interface PathParameters {
            productCatalogueID: Parameters.ProductCatalogueID;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsProductTypesProductTypeId {
        namespace Parameters {
            export type ProductTypeID = number;
        }
        export interface PathParameters {
            productTypeID: Parameters.ProductTypeID;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsPropertiesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            usage: "FACILITY";
            type: "BOOLEAN" | "NUMBER" | "TEXT";
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsPropertiesIdReorder {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            order: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId {
        namespace Parameters {
            export type ReservationExpirationTimeID = number;
        }
        export interface PathParameters {
            reservationExpirationTimeID: Parameters.ReservationExpirationTimeID;
        }
        export interface RequestBody {
            name: string;
            daysBefore: number;
            expirationValue: number;
            expirationType: "HOUR" | "DAY" | "MINUTE";
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsSalesChannelsSalesChannelId {
        namespace Parameters {
            export type SalesChannelID = number;
        }
        export interface PathParameters {
            salesChannelID: Parameters.SalesChannelID;
        }
        export interface RequestBody {
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsSeasonsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            dateFrom: string; // date-time
            dateTo: string; // date-time
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsStationsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            description?: string | null;
            descriptionLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            code: string;
            type: "AIR" | "BUS";
            timezone: string;
            destinationID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsTextTemplatesTextTemplateId {
        namespace Parameters {
            export type TextTemplateID = number;
        }
        export interface PathParameters {
            textTemplateID: Parameters.TextTemplateID;
        }
        export interface RequestBody {
            name?: string;
            usage?: "DESTINATION" | "AIR_TRANSPORT" | "BUS_TRANSPORT" | "SERVICE";
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId {
        namespace Parameters {
            export type TextItemID = number;
            export type TextTemplateID = number;
        }
        export interface PathParameters {
            textItemID: Parameters.TextItemID;
            textTemplateID: Parameters.TextTemplateID;
        }
        export interface RequestBody {
            name?: string;
            xmlName?: string | null;
            maxLength?: null | number;
            textTemplateID?: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsUnitTemplatePropertiesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsUnitTemplatesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            description?: string | null;
            descriptionLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
            fixedCount: number;
            extraBedCount: number;
            withoutBedCount: number;
            minimumPersonCount: number;
            facilityType: "FAMILY_SUITE" | "FAMILY_ROOM" | "APARTMAN" | "STUDIO" | "DELUXE";
            unitTemplatePropertyID: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsVatRatesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            value: number; // float
            label: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1EnumerationsWebProjectsCode {
        namespace Parameters {
            export type Code = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            code: Parameters.Code;
        }
        export interface RequestBody {
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1FacilitiesFacilityId {
        namespace Parameters {
            export type FacilityID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            VAT: boolean;
            published: boolean;
            commissionSale: boolean;
            note?: string | null;
            latitude: number; // float
            longitude: number; // float
            zoom: number;
            facilityCategoryOur: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7; // float
            facilityCategoryOfficial: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5; // float
            maxInfantAge: number;
            destinationID: number;
            facilityTypeID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1FacilitiesFacilityIdFacilityPropertyCategories {
        namespace Parameters {
            export type FacilityID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
        }
        export interface RequestBody {
            facilityPropertyCategories?: {
                key: "BASE" | "LOCATION" | "BEACHES" | "DESCRIPTION" | "SPORT" | "ACCOMMODATION" | "MEAL_PLANS";
                facilityProperties?: ({
                    id: number;
                    type: "TEXT";
                    value: string;
                    valueLocalization?: {
                        languageCode: string;
                        webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                        value: string;
                    }[];
                } | {
                    id: number;
                    type: "BOOLEAN";
                    value: boolean;
                } | {
                    id: number;
                    type: "NUMBER";
                    value: number; // float
                })[];
                mealPlanIDs?: number[];
                textLocalization?: {
                    languageCode: string;
                    webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                    value: string;
                }[];
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId {
        namespace Parameters {
            export type FacilityID = number;
            export type FileID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
            fileID: Parameters.FileID;
        }
        export interface QueryParameters {
            webProjectCode?: Parameters.WebProjectCode;
        }
        export interface RequestBody {
            orderIndex: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId {
        namespace Parameters {
            export type FacilityID = number;
            export type UnitTemplateID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
            unitTemplateID: Parameters.UnitTemplateID;
        }
        export interface RequestBody {
            order: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1FilesFileIdSetTags {
        namespace Parameters {
            export type FileID = number;
        }
        export interface PathParameters {
            fileID: Parameters.FileID;
        }
        export interface RequestBody {
            tags: [
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?
            ];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1FilesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            title?: string | null;
            altText?: string | null;
            description?: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                file: {
                    id: number;
                    displayName: string;
                    dataType: "PDF" | "IMAGE" | "DOC" | "EXCEL" | "ZIP" | "RAR" | "OTHER";
                    path: string;
                    pathFileName: string;
                    size: number;
                    title: string | null;
                    altText: string | null;
                    description: string | null;
                    mimeType: string;
                };
            }
        }
    }
    namespace PatchApiV1InsurancesInsuranceId {
        namespace Parameters {
            export type InsuranceID = number;
        }
        export interface PathParameters {
            insuranceID: Parameters.InsuranceID;
        }
        export interface RequestBody {
            name: string;
            description: string;
            insuranceContractNumber: string;
            personPrice: number; // float
            currencyCode: string;
            insuranceCompanyID: number;
            personTypeID: number;
            fileID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1LinesLineId {
        namespace Parameters {
            export type LineID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
        }
        export interface RequestBody {
            type: "AIR" | "BUS";
            code: string;
            direction: "FORTH" | "BACK";
            connectionType: "CHARTER" | "REGULAR";
            collection: boolean;
            note?: string | null;
            carrierID: number;
            startStationID: number;
            endStationID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1LinesLineIdStationsStationId {
        namespace Parameters {
            export type LineID = number;
            export type StationID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            stationID: Parameters.StationID;
        }
        export interface RequestBody {
            priceLevel?: number | null; // float
            timeShift?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1LinesLineIdStationsStationIdReorder {
        namespace Parameters {
            export type LineID = number;
            export type StationID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            stationID: Parameters.StationID;
        }
        export interface RequestBody {
            order: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1LinesLineIdTermsTermIdStationsStationId {
        namespace Parameters {
            export type LineID = number;
            export type StationID = number;
            export type TermID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            termID: Parameters.TermID;
            stationID: Parameters.StationID;
        }
        export interface RequestBody {
            priceLevel?: number | null; // float
            timeShift?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1LinesLineIdTermsTermIdStationsStationIdReorder {
        namespace Parameters {
            export type LineID = number;
            export type StationID = number;
            export type TermID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            termID: Parameters.TermID;
            stationID: Parameters.StationID;
        }
        export interface RequestBody {
            order: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1LinesLineIdTextItemsTextItemId {
        namespace Parameters {
            export type LanguageCode = string;
            export type LineID = number;
            export type TextItemID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            textItemID: Parameters.TextItemID;
        }
        export interface QueryParameters {
            languageCode: Parameters.LanguageCode;
            webProjectCode: Parameters.WebProjectCode;
        }
        export interface RequestBody {
            value: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                updatedAt: string;
            }
        }
    }
    namespace PatchApiV1LinesLineIdUnitTemplatesUnitTemplateId {
        namespace Parameters {
            export type LineID = number;
            export type UnitTemplateID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            unitTemplateID: Parameters.UnitTemplateID;
        }
        export interface RequestBody {
            order: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1LinesRoadsBulk {
        export interface RequestBody {
            roadIDs: number /* float */[];
            code?: string | null;
            maxLuggageWeight?: null | number;
            meetupBefore?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1LinesRoadsRoadId {
        namespace Parameters {
            export type RoadID = number;
        }
        export interface PathParameters {
            roadID: Parameters.RoadID;
        }
        export interface RequestBody {
            code?: string | null;
            maxLuggageWeight?: null | number;
            meetupBefore?: null | number;
            departureDatetime?: string; // date-time
            arrivalDatetime?: string; // date-time
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1LinesRoadsRoadTerms {
        export interface RequestBody {
            serviceID: number; // float
            roadTerms: {
                roadID: number | null; // float
                termID: number; // float
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1OrganizationBranchesId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            code?: string | null;
            name?: string | null;
            phone?: string | null;
            email?: string | null; // email
            fax?: string | null;
            addresses: [
                {
                    street?: string;
                    streetNumber?: string;
                    orientationNumber?: string;
                    description?: string;
                    zip?: string;
                    city: string;
                    pobox?: string;
                    countryID: number;
                    types: ("CORRESPONDENCE" | "PRESENTATION" | "BILLING" | "ORGANIZATION")[];
                },
                ...{
                    street?: string;
                    streetNumber?: string;
                    orientationNumber?: string;
                    description?: string;
                    zip?: string;
                    city: string;
                    pobox?: string;
                    countryID: number;
                    types: ("CORRESPONDENCE" | "PRESENTATION" | "BILLING" | "ORGANIZATION")[];
                }[]
            ];
            organizationID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1OrganizationsId {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export interface RequestBody {
            name: string;
            businessID?: string | null;
            taxID?: string | null;
            vatID?: string | null;
            isVATPayer: boolean;
            web?: string | null;
            phone?: string | null;
            email?: string | null; // email
            fax?: string | null;
            companyBranchID: number;
            address?: {
                street?: string | null;
                streetNumber?: string | null;
                orientationNumber?: string | null;
                description?: string | null;
                zip?: string | null;
                city: string;
                pobox?: string | null;
                countryID: number;
            } | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1PaymentsPaymentId {
        namespace Parameters {
            export type PaymentID = number;
        }
        export interface PathParameters {
            paymentID: Parameters.PaymentID;
        }
        export interface RequestBody {
            iban: string; // ^[a-zA-Z0-9]*$
            variableSymbol: string;
            specificSymbol?: string | null;
            constantSymbol?: string | null;
            swift?: string /* ^[a-zA-Z0-9]*$ */ | string /* ^[a-zA-Z0-9]*$ */ | null;
            amount: number; // float
            receivedAt: string; // date-time
            note?: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1RolesRoleId {
        namespace Parameters {
            export type RoleID = number;
        }
        export interface PathParameters {
            roleID: Parameters.RoleID;
        }
        export interface RequestBody {
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1RolesRoleIdSetPermissions {
        namespace Parameters {
            export type RoleID = number;
        }
        export interface PathParameters {
            roleID: Parameters.RoleID;
        }
        export interface RequestBody {
            permissionIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceId {
        namespace Parameters {
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        export interface RequestBody {
            name: string;
            type: "TRANSPORTATION" | "FACILITY";
            ownership: "PURCHASED" | "OWN";
            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
            offerForSale: boolean;
            offerForCalculation: boolean;
            offerForTransportSale: boolean;
            offerFrom?: string | null; // date-time
            offerTo?: string | null; // date-time
            published: boolean;
            hidePrices: boolean;
            vatRateID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdApplyPriceAndCostCalculations {
        namespace Parameters {
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdGalleryReorderImagesFileId {
        namespace Parameters {
            export type FileID = number;
            export type ServiceID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            fileID: Parameters.FileID;
        }
        export interface QueryParameters {
            webProjectCode?: Parameters.WebProjectCode;
        }
        export interface RequestBody {
            orderIndex: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk {
        namespace Parameters {
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        export interface RequestBody {
            isForbidden: boolean;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdTermsTermIdPriceGroups {
        namespace Parameters {
            export type ServiceID = number;
            export type TermID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            termID: Parameters.TermID;
        }
        export interface RequestBody {
            priceGroupID: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport {
        namespace Parameters {
            export type ServiceID = number;
            export type TermID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            termID: Parameters.TermID;
        }
        export interface RequestBody {
            isForbidden: boolean;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdTextItemsTextItemId {
        namespace Parameters {
            export type LanguageCode = string;
            export type ServiceID = number;
            export type TextItemID = number;
            export type WebProjectCode = "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            textItemID: Parameters.TextItemID;
        }
        export interface QueryParameters {
            languageCode: Parameters.LanguageCode;
            webProjectCode: Parameters.WebProjectCode;
        }
        export interface RequestBody {
            value: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                updatedAt: string;
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId {
        namespace Parameters {
            export type IndividualUnitTemplateID = number;
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            individualUnitTemplateID: Parameters.IndividualUnitTemplateID;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            description?: string | null;
            descriptionLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            fixedCount: number;
            extraBedCount: null | number;
            withoutBedCount: null | number;
            minimumPersonCount: null | number;
            occupancyAlternatives: {
                fixedPersonTypeIDs: number[];
                extraBedPersonTypeIDs: number[];
                withoutBedPersonTypeIDs: number[];
            }[];
            facilityType: string | null;
            unitTemplatePropertyID: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId {
        namespace Parameters {
            export type PricelistItemID = number;
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            pricelistItemID: Parameters.PricelistItemID;
        }
        export interface RequestBody {
            type: "FIXED_PRICE" | "PERCENT_REFERENCE" | "PERCENT_REFERENCE_DISCOUNT" | "SURCHARGE_COSTS_PERCENT" | "SURCHARGE_TERM" | "SURCHARGE_PERCENT_WITH_FIXED_PRICE";
            reference: boolean;
            individualPricelistItem?: {
                name: string;
                nameLocalization?: {
                    languageCode: string;
                    webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                    value: string;
                }[];
                extraBed: [
                    number
                ] | [
                    ("OCCUPANCY_ALL_PERSONS_EXTRA_BED")
                ] | null;
                withoutBed: [
                    number
                ] | [
                    ("OCCUPANCY_ALL_PERSONS_WITHOUT_BED")
                ] | null;
                category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
                timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
                unitRelation: "PERSON" | "UNIT";
                params: {
                    value: number;
                } | null;
                personTypeIDs: number[];
                mealPlanID?: null | number;
            };
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                serviceUnitTemplatePricelistItem?: {
                    id: string;
                };
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
            export type ServiceUnitTemplatePricelistItemID = number | string;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            serviceUnitTemplatePricelistItemID: Parameters.ServiceUnitTemplatePricelistItemID;
        }
        export interface RequestBody {
            costSeasons: {
                value: number; // float
                validityAllTerms: boolean;
                costSeasonItems: [
                ] | [
                    {
                        dateFrom: string; // date-time
                        dateTo: string; // date-time
                    },
                    ...{
                        dateFrom: string; // date-time
                        dateTo: string; // date-time
                    }[]
                ];
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId {
        namespace Parameters {
            export type IndividualPricelistItemID = number | string /* uuid */;
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
            export type ServiceUnitTemplatePricelistItemID = string;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            serviceUnitTemplatePricelistItemID: Parameters.ServiceUnitTemplatePricelistItemID;
            individualPricelistItemID: Parameters.IndividualPricelistItemID;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            extraBed: [
                number
            ] | [
                ("OCCUPANCY_ALL_PERSONS_EXTRA_BED")
            ] | null;
            withoutBed: [
                number
            ] | [
                ("OCCUPANCY_ALL_PERSONS_WITHOUT_BED")
            ] | null;
            category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
            timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
            unitRelation: "PERSON" | "UNIT";
            params: {
                value: number;
            } | null;
            personTypeIDs: number[];
            mealPlanID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
            export type ServiceUnitTemplatePricelistItemID = string;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            serviceUnitTemplatePricelistItemID: Parameters.ServiceUnitTemplatePricelistItemID;
        }
        export interface RequestBody {
            termID: number;
            price?: number | null; // float
            calculationFixedSurcharge?: number | null; // float
            calculationPercent?: number | null; // float
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
            export type ServiceUnitTemplatePricelistItemID = string;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
            serviceUnitTemplatePricelistItemID: Parameters.ServiceUnitTemplatePricelistItemID;
        }
        export interface RequestBody {
            price?: number | null; // float
            calculationFixedSurcharge?: number | null; // float
            calculationPercent?: number | null; // float
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity {
        namespace Parameters {
            export type LineID = null | number;
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
        }
        export interface QueryParameters {
            lineID?: Parameters.LineID;
        }
        export interface RequestBody {
            termID: number;
            capacity: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk {
        namespace Parameters {
            export type LineID = null | number;
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
        }
        export interface QueryParameters {
            lineID?: Parameters.LineID;
        }
        export interface RequestBody {
            capacity: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
        }
        export interface RequestBody {
            termID: number;
            discountValue: number | null; // float
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
        }
        export interface RequestBody {
            discountValue: number | null; // float
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote {
        namespace Parameters {
            export type ServiceID = number;
            export type ServiceUnitTemplateID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            serviceUnitTemplateID: Parameters.ServiceUnitTemplateID;
        }
        export interface RequestBody {
            termID: number;
            note: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1TermSerialsId {
        namespace Parameters {
            export type Id = number; // float
        }
        export interface PathParameters {
            id: Parameters.Id /* float */;
        }
        export interface RequestBody {
            name: string;
            termPrefix: string;
            destinationSeasonID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1TermSerialsTerms {
        export interface RequestBody {
            terms: {
                id: number;
                dateFrom: string; // date-time
                dateTo: string; // date-time
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1UsersSettings {
        export interface RequestBody {
            pagination?: 25 | 50 | 100;
            productSearchFilters?: ("NIGHTS_COUNT" | "HOTEL_CATEGORY" | "OCCUPANCY" | "PRICE_RANGE" | "MEAL_PLAN" | "BEACH_DISTANCE" | "PRICE_FLAG" | "DISCOUNT_AMOUNT")[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                userSetting: {
                    pagination: 25 | 50 | 100;
                    productSearchFilters: ("NIGHTS_COUNT" | "HOTEL_CATEGORY" | "OCCUPANCY" | "PRICE_RANGE" | "MEAL_PLAN" | "BEACH_DISTANCE" | "PRICE_FLAG" | "DISCOUNT_AMOUNT")[] | null;
                } | null;
            }
        }
    }
    namespace PatchApiV1UsersUserId {
        namespace Parameters {
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        export interface RequestBody {
            name: string;
            surname: string;
            email: string; // email
            ipAddresses?: [
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?,
                string?
            ];
            companyBranchIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1UsersUserIdResendRegistrationEmail {
        namespace Parameters {
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1UsersUserIdSendResetPasswordEmail {
        namespace Parameters {
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PatchApiV1UsersUserIdSetPermissions {
        namespace Parameters {
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        export interface RequestBody {
            permissionIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1AuthorizationForgotPassword {
        export interface RequestBody {
            email: string; // email
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1AuthorizationLogin {
        export interface RequestBody {
            email: string;
            password: string;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
                profile: {
                    id: number;
                    fullname: string;
                };
            }
        }
    }
    namespace PostApiV1AuthorizationLoginAsUser {
        export interface RequestBody {
            loginAsUserID: number;
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
            }
        }
    }
    namespace PostApiV1AuthorizationPing {
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                accessToken: string;
            }
        }
    }
    namespace PostApiV1AuthorizationResetPassword {
        export interface RequestBody {
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
        }
    }
    namespace PostApiV1BusinessCasesBusinessCaseIdNotes {
        namespace Parameters {
            export type BusinessCaseID = number;
        }
        export interface PathParameters {
            businessCaseID: Parameters.BusinessCaseID;
        }
        export interface RequestBody {
            note: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1Commisions {
        export interface RequestBody {
            name: string;
            validFrom?: string | null; // date-time
            validTo?: string | null; // date-time
            value: number; // float
            companyIDs: number[];
            productTypeIDs?: number[];
            allowedDestinationIDs?: number[];
            allowedDestinationSeasonIDs?: number[];
            allowedFacilityIDs?: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                commision: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1Companies {
        export interface RequestBody {
            name: string;
            businessID?: string | null;
            taxID?: string | null;
            vatID?: string | null;
            isVATPayer: boolean;
            web?: string | null;
            phone?: string | null;
            email?: string | null; // email
            generalTermsAndConditionsUrl?: string | null;
            commercialRegisterEntry?: string | null;
            color: string; // ^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
            iban: string; // ^[a-zA-Z0-9]*$
            swift: string /* ^[a-zA-Z0-9]*$ */ | string /* ^[a-zA-Z0-9]*$ */;
            addresses: [
                {
                    street?: string | null;
                    streetNumber?: string | null;
                    orientationNumber?: string | null;
                    description?: string | null;
                    zip?: string | null;
                    city: string;
                    pobox?: string | null;
                    countryID: number;
                    types: ("ORGANIZATION")[];
                }
            ];
            stampFileID: number;
            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR";
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                company: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1CompanyBranches {
        export interface RequestBody {
            code: number;
            name?: string | null;
            phone?: string | null;
            email?: string | null; // email
            fax?: string | null;
            info?: string | null;
            openingHours?: [
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                },
                {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    note?: string | null;
                    timeRanges: {
                        timeFrom: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                        timeTo: string; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                    }[];
                }
            ] | null;
            addresses: [
                {
                    street?: string | null;
                    streetNumber?: string | null;
                    orientationNumber?: string | null;
                    description?: string | null;
                    zip?: string | null;
                    city: string;
                    pobox?: string | null;
                    countryID: number;
                    types: ("ORGANIZATION")[];
                }
            ];
            companyID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                companyBranch: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1DestinationSeasons {
        export interface RequestBody {
            name: string;
            published: boolean;
            destinationID: number;
            seasonID: number;
            vatRateID?: null | number;
            productTypeIDs: number[];
            productCatalogueIDs: number[];
            webProjectCodes?: ("TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON")[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                destinationSeason: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances {
        namespace Parameters {
            export type DestinationSeasonID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        export interface RequestBody {
            name: string;
            description: string;
            insuranceContractNumber: string;
            personPrice: number; // float
            insuranceID: number;
            currencyCode: string;
            insuranceCompanyID: number;
            personTypeID: number;
            fileID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                generalInsurance: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems {
        namespace Parameters {
            export type DestinationSeasonID = number;
        }
        export interface PathParameters {
            destinationSeasonID: Parameters.DestinationSeasonID;
        }
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            extraBed: [
                number
            ] | [
                ("OCCUPANCY_ALL_PERSONS_EXTRA_BED")
            ] | null;
            withoutBed: [
                number
            ] | [
                ("OCCUPANCY_ALL_PERSONS_WITHOUT_BED")
            ] | null;
            usage: "FACILITY" | "TRANSPORTATION";
            category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
            timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
            unitRelation: "PERSON" | "UNIT";
            params: {
                value: number;
            } | null;
            price: number; // float
            pricelistItemID: number;
            personTypeIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                generalPricelistItem: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1Destinations {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            latitude: number; // float
            longitude: number; // float
            zoom: number;
            timezone?: string | null;
            countryID?: null | number;
            parentID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                destination: {
                    id: number;
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1DestinationsDestinationIdGalleryAssignImages {
        namespace Parameters {
            export type DestinationID = number;
        }
        export interface PathParameters {
            destinationID: Parameters.DestinationID;
        }
        export interface RequestBody {
            orderIndex: number;
            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
            fileIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1Discounts {
        export interface RequestBody {
            name: string;
            validFrom?: string | null; // date-time
            validTo?: string | null; // date-time
            type: "OLD_BUSINESS_CASE" | "NEW_BUSINESS_CASE" | "LIMIT_CAPACITY_UNIT_TEMPLATE" | "TRIP" | "CASHBACK";
            valueType: "PERCENT" | "FIX";
            value: number; // float
            applyCount: number;
            unitTemplateType: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
            transportationType: "AIR" | "BUS" | "INDIVIDUAL";
            discountMarkIDs?: number[];
            productTypeIDs?: number[];
            allowedDestinationIDs?: number[];
            allowedDestinationSeasonIDs?: number[];
            disallowedDestinationSeasonIDs?: number[];
            allowedFacilityIDs?: number[];
            allowedServiceUnitTemplateIDs?: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                discount: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1DocumentsReservationCalculationsExport {
        export interface RequestBody {
            customer: {
                person?: {
                    title?: string | null;
                    name: string;
                    surname: string;
                    phone?: string | null;
                    email?: string | null; // email
                    address: {
                        street?: string | null;
                        streetNumber: string;
                        orientationNumber?: string | null;
                        zip: string;
                        city: string;
                        countryID: number;
                    };
                };
                organization?: {
                    name: string;
                    businessID?: string | null;
                    taxID?: string | null;
                    vatID?: string | null;
                    isVATPayer: boolean;
                    phone?: string | null;
                    email?: string | null; // email
                    address: {
                        street?: string | null;
                        streetNumber: string;
                        orientationNumber?: string | null;
                        zip: string;
                        city: string;
                        countryID: number;
                    };
                    contactPerson?: {
                        title?: string | null;
                        name: string;
                        surname: string;
                        phone?: string | null;
                        email?: string | null; // email
                        address?: {
                            street?: string | null;
                            streetNumber: string;
                            orientationNumber?: string | null;
                            zip: string;
                            city: string;
                            countryID: number;
                        } | null;
                    } | null;
                };
                customerID?: null | number;
            };
            travelers: {
                isContact: boolean;
                passport?: string | null;
                passportValidTo?: string | null; // date-time
                name: string;
                surname: string;
                gender: "MALE" | "FEMALE";
                birthdate: string; // date-time
                phone?: string | null;
                email?: string | null; // email
                address?: {
                    street?: string | null;
                    streetNumber: string;
                    orientationNumber?: string | null;
                    zip: string;
                    city: string;
                    countryID: number;
                } | null;
                personID?: null | number;
                id: number;
                facility: {
                    serviceUnitTemplateID: number;
                    roomID: number;
                };
                transportation: {
                    serviceUnitTemplateID: number;
                    stationID: number;
                };
                additionalServices?: {
                    id: number;
                    type: "GENERAL_PRICELIST_ITEM" | "INDIVIDUAL_PRICELIST_ITEM" | "GENERAL_INSURANCE";
                }[];
            }[];
            reservation: {
                termID: number;
            };
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1DocumentsReservationCalculationsSend {
        export interface RequestBody {
            customer: {
                person?: {
                    title?: string | null;
                    name: string;
                    surname: string;
                    phone?: string | null;
                    email?: string | null; // email
                    address: {
                        street?: string | null;
                        streetNumber: string;
                        orientationNumber?: string | null;
                        zip: string;
                        city: string;
                        countryID: number;
                    };
                };
                organization?: {
                    name: string;
                    businessID?: string | null;
                    taxID?: string | null;
                    vatID?: string | null;
                    isVATPayer: boolean;
                    phone?: string | null;
                    email?: string | null; // email
                    address: {
                        street?: string | null;
                        streetNumber: string;
                        orientationNumber?: string | null;
                        zip: string;
                        city: string;
                        countryID: number;
                    };
                    contactPerson?: {
                        title?: string | null;
                        name: string;
                        surname: string;
                        phone?: string | null;
                        email?: string | null; // email
                        address?: {
                            street?: string | null;
                            streetNumber: string;
                            orientationNumber?: string | null;
                            zip: string;
                            city: string;
                            countryID: number;
                        } | null;
                    } | null;
                };
                customerID?: null | number;
            };
            travelers: {
                isContact: boolean;
                passport?: string | null;
                passportValidTo?: string | null; // date-time
                name: string;
                surname: string;
                gender: "MALE" | "FEMALE";
                birthdate: string; // date-time
                phone?: string | null;
                email?: string | null; // email
                address?: {
                    street?: string | null;
                    streetNumber: string;
                    orientationNumber?: string | null;
                    zip: string;
                    city: string;
                    countryID: number;
                } | null;
                personID?: null | number;
                id: number;
                facility: {
                    serviceUnitTemplateID: number;
                    roomID: number;
                };
                transportation: {
                    serviceUnitTemplateID: number;
                    stationID: number;
                };
                additionalServices?: {
                    id: number;
                    type: "GENERAL_PRICELIST_ITEM" | "INDIVIDUAL_PRICELIST_ITEM" | "GENERAL_INSURANCE";
                }[];
            }[];
            reservation: {
                termID: number;
            };
            emails: string /* email */[];
            message?: string | null;
            password: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1DocumentsReservationsReservationIdSend {
        namespace Parameters {
            export type ReservationID = number;
        }
        export interface PathParameters {
            reservationID: Parameters.ReservationID;
        }
        export interface RequestBody {
            emails: string /* email */[];
            password: string;
            message?: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1EnumerationsCarriers {
        export interface RequestBody {
            name: string;
            businessID?: string | null;
            taxID?: string | null;
            vatID?: string | null;
            isVATPayer: boolean;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                carrier: {
                    id: number;
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsCountries {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            isoCode?: string | null;
            vatRateID?: null | number;
            currencyCode?: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                country: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsCurrencies {
        export interface RequestBody {
            code: string;
            sign: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                currency: {
                    id: string;
                    code: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsDepositAmounts {
        export interface RequestBody {
            percent: number; // float
            daysTillDepart: number;
        }
        namespace Responses {
            export interface $200 {
                depositAmount: {
                    id: number;
                    daysTillDepart: number;
                };
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1EnumerationsDiscountMarks {
        export interface RequestBody {
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                discountMark: {
                    id: number; // float
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsExchangeRates {
        export interface RequestBody {
            dateFrom: string; // date-time
            dateTo: string; // date-time
            currencyCodeFrom: string;
            currencyCodeTo: string;
            value: number; // float
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                exchangeRate: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsFacilityTypes {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                facilityType: {
                    id: number;
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsInsuranceCompanies {
        export interface RequestBody {
            name: string;
            businessID: string;
            businessRegistration: string;
            taxID: string;
            vatID: string;
            web: string;
            email: string; // email
            infoLine: string;
            emergencyLine: string;
            address: {
                street: string;
                streetNumber: string;
                orientationNumber?: string | null;
                description?: string | null;
                zip: string;
                city: string;
                pobox?: string | null;
                countryID: number;
            };
            logoID: number;
            generalInsuranceConditionsID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                insuranceCompany: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsLanguages {
        export interface RequestBody {
            code: string;
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                language: {
                    id: string;
                    code: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsMealPlans {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            label: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                mealPlan: {
                    id: number;
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsPersonTypes {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            ageFrom: number;
            ageTo: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                personType: {
                    id: number;
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsPriceGroups {
        export interface RequestBody {
            name: string;
            color: string; // ^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                priceGroup: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsPricelistItems {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            usage: "FACILITY" | "TRANSPORTATION";
            category: "BASE_PRICE" | "REQUIRED_SURCHARGE" | "OPTIONAL_SURCHARGE";
            timeRelation: "NIGHT" | "DAY" | "X_NIGHTS" | "TRIP";
            unitRelation: "PERSON" | "UNIT";
            params: {
                value: number;
            } | null;
            personTypeIDs: number[];
            mealPlanID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                pricelistItem: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsProductCatalogues {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                productCatalogue: {
                    id: number;
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsProductTypes {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                productType: {
                    id: number;
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsProperties {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            usage: "FACILITY";
            type: "BOOLEAN" | "NUMBER" | "TEXT";
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                property: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsReservationExpirationTimes {
        export interface RequestBody {
            name: string;
            daysBefore: number;
            expirationValue: number;
            expirationType: "HOUR" | "DAY" | "MINUTE";
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                reservationExpirationTime: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsSalesChannels {
        export interface RequestBody {
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                salesChannel: {
                    id: number; // float
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsSeasons {
        export interface RequestBody {
            name: string;
            dateFrom: string; // date-time
            dateTo: string; // date-time
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                season: {
                    id: number;
                    name: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsStations {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            description?: string | null;
            descriptionLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            code: string;
            type: "AIR" | "BUS";
            timezone: string;
            destinationID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                station: {
                    id: number;
                    name: string;
                    code: string;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsTextTemplates {
        export interface RequestBody {
            name: string;
            usage: "DESTINATION" | "AIR_TRANSPORT" | "BUS_TRANSPORT" | "SERVICE";
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                textTemplate: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsTextTemplatesTextTemplateIdTextItems {
        namespace Parameters {
            export type TextTemplateID = number;
        }
        export interface PathParameters {
            textTemplateID: Parameters.TextTemplateID;
        }
        export interface RequestBody {
            name: string;
            xmlName?: string | null;
            maxLength?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                textItem: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsUnitTemplateProperties {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                unitTemplateProperty: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsUnitTemplates {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            description?: string | null;
            descriptionLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            type: "FACILITY" | "AIR_TRANSPORT" | "BUS_TRANSPORT";
            fixedCount: number;
            extraBedCount: number;
            withoutBedCount: number;
            minimumPersonCount: number;
            facilityType: "FAMILY_SUITE" | "FAMILY_ROOM" | "APARTMAN" | "STUDIO" | "DELUXE";
            unitTemplatePropertyID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                unitTemplate: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1EnumerationsVatRates {
        export interface RequestBody {
            value: number; // float
            label: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                vatRate: {
                    id: number;
                    label: string;
                };
            }
        }
    }
    namespace PostApiV1Facilities {
        export interface RequestBody {
            name: string;
            nameLocalization?: {
                languageCode: string;
                webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                value: string;
            }[];
            VAT: boolean;
            published: boolean;
            commissionSale: boolean;
            note?: string | null;
            latitude: number; // float
            longitude: number; // float
            zoom: number;
            facilityCategoryOur: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5 | 5.5 | 6 | 6.5 | 7; // float
            facilityCategoryOfficial: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5; // float
            maxInfantAge: number;
            destinationID: number;
            facilityTypeID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                facility: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1FacilitiesFacilityIdGalleryAssignImages {
        namespace Parameters {
            export type FacilityID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
        }
        export interface RequestBody {
            orderIndex: number;
            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
            fileIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId {
        namespace Parameters {
            export type FacilityID = number;
            export type UnitTemplateID = number;
        }
        export interface PathParameters {
            facilityID: Parameters.FacilityID;
            unitTemplateID: Parameters.UnitTemplateID;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                facilityUnitTemplate: {
                    facilityID: number;
                    unitTemplateID: number;
                };
            }
        }
    }
    namespace PostApiV1Files {
        export interface RequestBody {
            pathToFolder: string;
            title?: string;
            altText?: string;
            description?: string;
            tags?: string[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                file: {
                    id: number;
                    displayName: string;
                    dataType: "PDF" | "IMAGE" | "DOC" | "EXCEL" | "ZIP" | "RAR" | "OTHER";
                    path: string;
                    pathFileName: string;
                    size: number;
                    title: string | null;
                    altText: string | null;
                    description: string | null;
                    mimeType: string;
                };
            }
        }
    }
    namespace PostApiV1Folders {
        export interface RequestBody {
            pathToFolder: string;
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1Insurances {
        export interface RequestBody {
            name: string;
            description: string;
            insuranceContractNumber: string;
            personPrice: number; // float
            currencyCode: string;
            insuranceCompanyID: number;
            personTypeID: number;
            fileID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                insurance: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1Lines {
        export interface RequestBody {
            type: "AIR" | "BUS";
            code: string;
            direction: "FORTH" | "BACK";
            connectionType: "CHARTER" | "REGULAR";
            collection: boolean;
            note?: string | null;
            carrierID: number;
            startStationID: number;
            endStationID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                line: {
                    id: number;
                    code: string;
                    direction: "FORTH" | "BACK";
                };
            }
        }
    }
    namespace PostApiV1LinesLineIdStationsStationId {
        namespace Parameters {
            export type LineID = number;
            export type StationID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            stationID: Parameters.StationID;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                lineStation: {
                    lineID: number;
                    stationID: number;
                };
            }
        }
    }
    namespace PostApiV1LinesLineIdTermsTermIdStationsStationId {
        namespace Parameters {
            export type LineID = number;
            export type StationID = number;
            export type TermID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            termID: Parameters.TermID;
            stationID: Parameters.StationID;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                lineTermStation: {
                    lineID: number;
                    stationID: number;
                    termID: null | number;
                };
            }
        }
    }
    namespace PostApiV1LinesLineIdUnitTemplatesUnitTemplateId {
        namespace Parameters {
            export type LineID = number;
            export type UnitTemplateID = number;
        }
        export interface PathParameters {
            lineID: Parameters.LineID;
            unitTemplateID: Parameters.UnitTemplateID;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                lineUnitTemplate: {
                    lineID: number;
                    unitTemplateID: number;
                };
            }
        }
    }
    namespace PostApiV1LinesRoads {
        export interface RequestBody {
            code?: string | null;
            maxLuggageWeight?: null | number;
            meetupBefore?: null | number;
            departureDatetime: string; // date-time
            arrivalDatetime: string; // date-time
            lineID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                road: {
                    id: number;
                    code: string | null;
                    departureDatetime: string; // date-time
                    arrivalDatetime: string; // date-time
                };
            }
        }
    }
    namespace PostApiV1LinesRoadsGenerateRoads {
        export interface RequestBody {
            serviceID: number;
            termIDs: number /* float */[];
            forthRoadsOptions?: {
                lineID: number; // float
                shift: "SAME_DAY" | "ONE_DAY_BEFORE" | "TWO_DAYS_BEFORE";
                departureTime: string | null; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                arrivalTime: string | null; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                maxLuggageWeight?: null | number;
                meetupBefore?: null | number;
            };
            backRoadsOptions?: {
                lineID: number; // float
                shift: "SAME_DAY" | "ONE_DAY_AFTER" | "TWO_DAYS_AFTER";
                departureTime: string | null; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                arrivalTime: string | null; // ^(?:[01]\d|2[0-3]):(?:[0-5]\d)$
                maxLuggageWeight?: null | number;
                meetupBefore?: null | number;
            };
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1LinesRoadsRoadTerms {
        export interface RequestBody {
            serviceID: number; // float
            roadTerms: {
                roadID: number; // float
                termID: number; // float
            }[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                roadTerms: {
                    serviceID: number;
                    termID: number;
                    roadID: number;
                    direction: "FORTH" | "BACK";
                }[];
            }
        }
    }
    namespace PostApiV1OrganizationBranches {
        export interface RequestBody {
            code?: string | null;
            name?: string | null;
            phone?: string | null;
            email?: string | null; // email
            fax?: string | null;
            addresses: [
                {
                    street?: string;
                    streetNumber?: string;
                    orientationNumber?: string;
                    description?: string;
                    zip?: string;
                    city: string;
                    pobox?: string;
                    countryID: number;
                    types: ("CORRESPONDENCE" | "PRESENTATION" | "BILLING" | "ORGANIZATION")[];
                },
                ...{
                    street?: string;
                    streetNumber?: string;
                    orientationNumber?: string;
                    description?: string;
                    zip?: string;
                    city: string;
                    pobox?: string;
                    countryID: number;
                    types: ("CORRESPONDENCE" | "PRESENTATION" | "BILLING" | "ORGANIZATION")[];
                }[]
            ];
            organizationID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                organizationBranch: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1Organizations {
        export interface RequestBody {
            name: string;
            businessID?: string | null;
            taxID?: string | null;
            vatID?: string | null;
            isVATPayer: boolean;
            web?: string | null;
            phone?: string | null;
            email?: string | null; // email
            fax?: string | null;
            companyBranchID: number;
            address?: {
                street?: string | null;
                streetNumber?: string | null;
                orientationNumber?: string | null;
                description?: string | null;
                zip?: string | null;
                city: string;
                pobox?: string | null;
                countryID: number;
            } | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                organization: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1Payments {
        export interface RequestBody {
            iban: string; // ^[a-zA-Z0-9]*$
            variableSymbol: string;
            specificSymbol?: string | null;
            constantSymbol?: string | null;
            swift?: string /* ^[a-zA-Z0-9]*$ */ | string /* ^[a-zA-Z0-9]*$ */ | null;
            amount: number; // float
            receivedAt: string; // date-time
            note?: string | null;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                payment: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1ProductsAdditionalServices {
        export interface RequestBody {
            termID: number;
            facilityServiceUnitTemplates: {
                id: number;
                rooms: {
                    count: number;
                    occupancy: {
                        ADULT: {
                            count: number;
                        };
                        CHILD: {
                            count: number;
                            ages?: [
                            ] | [
                            ];
                        };
                    };
                }[];
            }[];
            transportationServiceUnitTemplateID: number;
        }
    }
    namespace PostApiV1ProductsCheckAvailability {
        export interface RequestBody {
            termID: number;
            facilityServiceUnitTemplates: {
                id: number;
                rooms: {
                    count: number;
                    occupancy: {
                        ADULT: {
                            count: number;
                        };
                        CHILD: {
                            count: number;
                            ages?: [
                            ] | [
                            ];
                        };
                    };
                }[];
            }[];
            transportationServiceUnitTemplateID: number;
        }
    }
    namespace PostApiV1ProductsPrice {
        export interface RequestBody {
            termID: number;
            facilityServiceUnitTemplates: {
                id: number;
                rooms: {
                    count: number;
                    occupancy: {
                        ADULT: {
                            count: number;
                        };
                        CHILD: {
                            count: number;
                            ages?: [
                            ] | [
                            ];
                        };
                    };
                }[];
            }[];
            transportationServiceUnitTemplateID: number;
        }
    }
    namespace PostApiV1ProductsPricePgsync {
        export interface RequestBody {
            termID: number;
            facilityServiceUnitTemplates: {
                id: number;
                rooms: {
                    count: number;
                    occupancy: {
                        ADULT: {
                            count: number;
                        };
                        CHILD: {
                            count: number;
                            ages?: [
                            ] | [
                            ];
                        };
                    };
                }[];
            }[];
            transportationServiceUnitTemplateID: number;
        }
    }
    namespace PostApiV1ProductsPriceTravelers {
        export interface RequestBody {
            termID: number;
            travelers: {
                id: number;
                name: string;
                surname: string;
                birthdate: string; // date-time
                facility: {
                    serviceUnitTemplateID: number;
                    roomID: number;
                };
                transportation: {
                    serviceUnitTemplateID: number;
                    stationID: number;
                };
                additionalServices?: {
                    id: number;
                    type: "GENERAL_PRICELIST_ITEM" | "INDIVIDUAL_PRICELIST_ITEM" | "GENERAL_INSURANCE";
                }[];
            }[];
        }
    }
    namespace PostApiV1ProductsReservation {
        export interface RequestBody {
            customer: {
                person?: {
                    title?: string | null;
                    name: string;
                    surname: string;
                    phone?: string | null;
                    email?: string | null; // email
                    address: {
                        street?: string | null;
                        streetNumber: string;
                        orientationNumber?: string | null;
                        zip: string;
                        city: string;
                        countryID: number;
                    };
                };
                organization?: {
                    name: string;
                    businessID?: string | null;
                    taxID?: string | null;
                    vatID?: string | null;
                    isVATPayer: boolean;
                    phone?: string | null;
                    email?: string | null; // email
                    address: {
                        street?: string | null;
                        streetNumber: string;
                        orientationNumber?: string | null;
                        zip: string;
                        city: string;
                        countryID: number;
                    };
                    contactPerson?: {
                        title?: string | null;
                        name: string;
                        surname: string;
                        phone?: string | null;
                        email?: string | null; // email
                        address?: {
                            street?: string | null;
                            streetNumber: string;
                            orientationNumber?: string | null;
                            zip: string;
                            city: string;
                            countryID: number;
                        } | null;
                    } | null;
                };
                customerID?: null | number;
                marketingAgreement?: boolean;
            };
            travelers: {
                isContact: boolean;
                passport?: string | null;
                passportValidTo?: string | null; // date-time
                name: string;
                surname: string;
                gender: "MALE" | "FEMALE";
                birthdate: string; // date-time
                phone?: string | null;
                email?: string | null; // email
                address?: {
                    street?: string | null;
                    streetNumber: string;
                    orientationNumber?: string | null;
                    zip: string;
                    city: string;
                    countryID: number;
                } | null;
                personID?: null | number;
                id: number;
                facility: {
                    serviceUnitTemplateID: number;
                    roomID: number;
                };
                transportation: {
                    serviceUnitTemplateID: number;
                    stationID: number;
                };
                additionalServices?: {
                    id: number;
                    type: "GENERAL_PRICELIST_ITEM" | "INDIVIDUAL_PRICELIST_ITEM" | "GENERAL_INSURANCE";
                }[];
            }[];
            reservation: {
                depositAmount: number; // float
                note?: string | null;
                reservationExpirationTimeID: number;
                termID: number;
            };
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                reservation: {
                    id: number;
                    businessCase: {
                        id: number;
                    };
                    reservationNumber: string;
                    reservationExpirationTime: {
                        id: number;
                        expirationValue: number;
                        expirationType: "HOUR" | "DAY" | "MINUTE";
                    };
                    expirationDatetime: string; // date-time
                    document: {
                        fileName: string;
                        filePath: string;
                    };
                };
            }
        }
    }
    namespace PostApiV1Roles {
        export interface RequestBody {
            name: string;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                role: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1RolesRoleIdAssignUsersUserId {
        namespace Parameters {
            export type RoleID = number;
            export type UserID = number;
        }
        export interface PathParameters {
            roleID: Parameters.RoleID;
            userID: Parameters.UserID;
        }
        export interface RequestBody {
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1Services {
        namespace Parameters {
            export type FacilityID = number;
        }
        export interface QueryParameters {
            facilityID?: Parameters.FacilityID;
        }
        export interface RequestBody {
            name?: string;
            type?: "TRANSPORTATION" | "FACILITY";
            ownership?: "PURCHASED" | "OWN";
            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
            offerForSale?: boolean;
            offerForCalculation?: boolean;
            offerForTransportSale?: boolean;
            offerFrom?: string | null; // date-time
            offerTo?: string | null; // date-time
            published?: boolean;
            hidePrices?: boolean;
            vatRateID?: null | number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                service: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1ServicesServiceIdGalleryAssignImages {
        namespace Parameters {
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        export interface RequestBody {
            orderIndex: number;
            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
            fileIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId {
        namespace Parameters {
            export type ServiceID = number;
            export type TermSerialID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            termSerialID: Parameters.TermSerialID;
        }
        export interface RequestBody {
            facilityID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                serviceTermSerialFacility: {
                    serviceID: number;
                    termSerialID: number;
                    facilityID: number;
                };
            }
        }
    }
    namespace PostApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId {
        namespace Parameters {
            export type ServiceID = number;
            export type TermSerialID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
            termSerialID: Parameters.TermSerialID;
        }
        export interface RequestBody {
            lineForthID: number;
            lineBackID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                serviceTermSerialLine: {
                    serviceID: number;
                    termSerialID: number;
                };
            }
        }
    }
    namespace PostApiV1ServicesServiceIdUnitTemplates {
        namespace Parameters {
            export type ServiceID = number;
        }
        export interface PathParameters {
            serviceID: Parameters.ServiceID;
        }
        export interface RequestBody {
            serviceUnitTemplates: [
                {
                    unitTemplateID: number;
                    lineID?: null | number;
                    individualUnitTemplate: {
                        name: string;
                        nameLocalization?: {
                            languageCode: string;
                            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                            value: string;
                        }[];
                        description?: string | null;
                        descriptionLocalization?: {
                            languageCode: string;
                            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                            value: string;
                        }[];
                        fixedCount: number;
                        extraBedCount: null | number;
                        withoutBedCount: null | number;
                        minimumPersonCount: null | number;
                        occupancyAlternatives: {
                            fixedPersonTypeIDs: number[];
                            extraBedPersonTypeIDs: number[];
                            withoutBedPersonTypeIDs: number[];
                        }[];
                        facilityType: string | null;
                        unitTemplatePropertyID: null | number;
                    };
                },
                {
                    unitTemplateID: number;
                    lineID?: null | number;
                    individualUnitTemplate: {
                        name: string;
                        nameLocalization?: {
                            languageCode: string;
                            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                            value: string;
                        }[];
                        description?: string | null;
                        descriptionLocalization?: {
                            languageCode: string;
                            webProjectCode?: "TIPTRAVEL" | "KOALA" | "HECHTER" | "SENECA" | "TATRATOUR" | "COMMON";
                            value: string;
                        }[];
                        fixedCount: number;
                        extraBedCount: null | number;
                        withoutBedCount: null | number;
                        minimumPersonCount: null | number;
                        occupancyAlternatives: {
                            fixedPersonTypeIDs: number[];
                            extraBedPersonTypeIDs: number[];
                            withoutBedPersonTypeIDs: number[];
                        }[];
                        facilityType: string | null;
                        unitTemplatePropertyID: null | number;
                    };
                }?
            ];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                serviceUnitTemplates: [
                    {
                        id: number;
                    },
                    {
                        id: number;
                    }?
                ];
            }
        }
    }
    namespace PostApiV1TermSerials {
        export interface RequestBody {
            name: string;
            termPrefix: string;
            destinationSeasonID: number;
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                termSerial: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1TermSerialsTermSerialIdTerms {
        namespace Parameters {
            export type TermSerialID = number;
        }
        export interface PathParameters {
            termSerialID: Parameters.TermSerialID;
        }
        export interface RequestBody {
            nightsCount: number;
            dateFrom: string; // date-time
            dateTo: string; // date-time
            repeat: {
                type: "START_AT_PREVIOUS_END" | "EVERY_X_DAY" | "EVERY_X_WEEK";
                options: {
                    day: any;
                } | {
                    days: any;
                    week: any;
                };
            };
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1TermSerialsTermsGenerate {
        export interface RequestBody {
            nightsCount: number;
            dateFrom: string; // date-time
            dateTo: string; // date-time
            repeat: {
                type: "START_AT_PREVIOUS_END" | "EVERY_X_DAY" | "EVERY_X_WEEK";
                options: {
                    day: any;
                } | {
                    days: any;
                    week: any;
                };
            };
        }
        namespace Responses {
            export interface $200 {
                terms: {
                    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
                    dateFrom: string; // date-time
                    dateTo: string; // date-time
                    nightsCount: number;
                }[];
            }
        }
    }
    namespace PostApiV1Users {
        export interface RequestBody {
            email: string; // email
            roleIDs: number[];
            permissionIDs?: number[];
            companyBranchIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
                user: {
                    id: number;
                };
            }
        }
    }
    namespace PostApiV1UsersConfirm {
        export interface RequestBody {
            name: string;
            surname: string;
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
    namespace PostApiV1UsersUserIdAssignRoles {
        namespace Parameters {
            export type UserID = number;
        }
        export interface PathParameters {
            userID: Parameters.UserID;
        }
        export interface RequestBody {
            roleIDs: number[];
        }
        namespace Responses {
            export interface $200 {
                messages: {
                    message: string;
                    type: "SUCCESS";
                }[];
            }
        }
    }
}

export interface OperationMethods {
  /**
   * postApiV1AuthorizationPing - PERMISSION: NO
   */
  'postApiV1AuthorizationPing'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1AuthorizationPing.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1AuthorizationPing.Responses.$200>
  /**
   * postApiV1AuthorizationForgotPassword - PERMISSION: NO
   */
  'postApiV1AuthorizationForgotPassword'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1AuthorizationForgotPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1AuthorizationForgotPassword.Responses.$200>
  /**
   * postApiV1AuthorizationResetPassword - PERMISSION: NO
   */
  'postApiV1AuthorizationResetPassword'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1AuthorizationResetPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV1Permissions - PERMISSION: NO
   */
  'getApiV1Permissions'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Permissions.Responses.$200>
  /**
   * getApiV1EnumerationsWebProjects - PERMISSION: NO
   */
  'getApiV1EnumerationsWebProjects'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsWebProjects.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsWebProjects.Responses.$200>
  /**
   * getApiV1EnumerationsWebProjectsCode - PERMISSION: NO
   */
  'getApiV1EnumerationsWebProjectsCode'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsWebProjectsCode.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsWebProjectsCode.Responses.$200>
  /**
   * patchApiV1EnumerationsWebProjectsCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsWebProjectsCode'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsWebProjectsCode.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsWebProjectsCode.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsWebProjectsCode.Responses.$200>
  /**
   * getApiV1EnumerationsLanguages - PERMISSION: NO
   */
  'getApiV1EnumerationsLanguages'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsLanguages.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsLanguages.Responses.$200>
  /**
   * postApiV1EnumerationsLanguages - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsLanguages'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsLanguages.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsLanguages.Responses.$200>
  /**
   * getApiV1EnumerationsLanguagesCode - PERMISSION: NO
   */
  'getApiV1EnumerationsLanguagesCode'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsLanguagesCode.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsLanguagesCode.Responses.$200>
  /**
   * patchApiV1EnumerationsLanguagesCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsLanguagesCode'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsLanguagesCode.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsLanguagesCode.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsLanguagesCode.Responses.$200>
  /**
   * deleteApiV1EnumerationsLanguagesCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsLanguagesCode'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsLanguagesCode.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsLanguagesCode.Responses.$200>
  /**
   * getApiV1EnumerationsFacilityTypes - PERMISSION: NO
   */
  'getApiV1EnumerationsFacilityTypes'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsFacilityTypes.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsFacilityTypes.Responses.$200>
  /**
   * postApiV1EnumerationsFacilityTypes - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsFacilityTypes'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsFacilityTypes.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsFacilityTypes.Responses.$200>
  /**
   * getApiV1EnumerationsFacilityTypesId - PERMISSION: NO
   */
  'getApiV1EnumerationsFacilityTypesId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsFacilityTypesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsFacilityTypesId.Responses.$200>
  /**
   * patchApiV1EnumerationsFacilityTypesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsFacilityTypesId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsFacilityTypesId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsFacilityTypesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsFacilityTypesId.Responses.$200>
  /**
   * deleteApiV1EnumerationsFacilityTypesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsFacilityTypesId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsFacilityTypesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsFacilityTypesId.Responses.$200>
  /**
   * getApiV1EnumerationsVatRates - PERMISSION: NO
   */
  'getApiV1EnumerationsVatRates'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsVatRates.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsVatRates.Responses.$200>
  /**
   * postApiV1EnumerationsVatRates - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsVatRates'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsVatRates.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsVatRates.Responses.$200>
  /**
   * getApiV1EnumerationsVatRatesId - PERMISSION: NO
   */
  'getApiV1EnumerationsVatRatesId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsVatRatesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsVatRatesId.Responses.$200>
  /**
   * patchApiV1EnumerationsVatRatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsVatRatesId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsVatRatesId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsVatRatesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsVatRatesId.Responses.$200>
  /**
   * deleteApiV1EnumerationsVatRatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsVatRatesId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsVatRatesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsVatRatesId.Responses.$200>
  /**
   * getApiV1EnumerationsCurrencies - PERMISSION: NO
   */
  'getApiV1EnumerationsCurrencies'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsCurrencies.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsCurrencies.Responses.$200>
  /**
   * postApiV1EnumerationsCurrencies - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsCurrencies'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsCurrencies.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsCurrencies.Responses.$200>
  /**
   * getApiV1EnumerationsCurrenciesCode - PERMISSION: NO
   */
  'getApiV1EnumerationsCurrenciesCode'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsCurrenciesCode.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsCurrenciesCode.Responses.$200>
  /**
   * patchApiV1EnumerationsCurrenciesCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsCurrenciesCode'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsCurrenciesCode.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsCurrenciesCode.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsCurrenciesCode.Responses.$200>
  /**
   * deleteApiV1EnumerationsCurrenciesCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsCurrenciesCode'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsCurrenciesCode.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsCurrenciesCode.Responses.$200>
  /**
   * getApiV1EnumerationsCountries - PERMISSION: NO
   */
  'getApiV1EnumerationsCountries'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsCountries.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsCountries.Responses.$200>
  /**
   * postApiV1EnumerationsCountries - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsCountries'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsCountries.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsCountries.Responses.$200>
  /**
   * getApiV1EnumerationsCountriesId - PERMISSION: NO
   */
  'getApiV1EnumerationsCountriesId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsCountriesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsCountriesId.Responses.$200>
  /**
   * patchApiV1EnumerationsCountriesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsCountriesId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsCountriesId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsCountriesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsCountriesId.Responses.$200>
  /**
   * deleteApiV1EnumerationsCountriesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsCountriesId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsCountriesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsCountriesId.Responses.$200>
  /**
   * getApiV1EnumerationsUnitTemplates - PERMISSION: NO
   */
  'getApiV1EnumerationsUnitTemplates'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsUnitTemplates.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsUnitTemplates.Responses.$200>
  /**
   * postApiV1EnumerationsUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsUnitTemplates'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsUnitTemplates.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsUnitTemplates.Responses.$200>
  /**
   * getApiV1EnumerationsUnitTemplatesId - PERMISSION: NO
   */
  'getApiV1EnumerationsUnitTemplatesId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsUnitTemplatesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsUnitTemplatesId.Responses.$200>
  /**
   * patchApiV1EnumerationsUnitTemplatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsUnitTemplatesId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsUnitTemplatesId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsUnitTemplatesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsUnitTemplatesId.Responses.$200>
  /**
   * deleteApiV1EnumerationsUnitTemplatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsUnitTemplatesId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsUnitTemplatesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsUnitTemplatesId.Responses.$200>
  /**
   * getApiV1EnumerationsTextTemplates - PERMISSION: NO
   */
  'getApiV1EnumerationsTextTemplates'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsTextTemplates.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsTextTemplates.Responses.$200>
  /**
   * postApiV1EnumerationsTextTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsTextTemplates'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsTextTemplates.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsTextTemplates.Responses.$200>
  /**
   * getApiV1EnumerationsTextTemplatesTextTemplateId - PERMISSION: NO
   */
  'getApiV1EnumerationsTextTemplatesTextTemplateId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateId.Responses.$200>
  /**
   * patchApiV1EnumerationsTextTemplatesTextTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsTextTemplatesTextTemplateId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateId.Responses.$200>
  /**
   * deleteApiV1EnumerationsTextTemplatesTextTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsTextTemplatesTextTemplateId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsTextTemplatesTextTemplateId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsTextTemplatesTextTemplateId.Responses.$200>
  /**
   * getApiV1EnumerationsTextTemplatesTextTemplateIdTextItems - PERMISSION: NO
   */
  'getApiV1EnumerationsTextTemplatesTextTemplateIdTextItems'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.PathParameters & Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.Responses.$200>
  /**
   * postApiV1EnumerationsTextTemplatesTextTemplateIdTextItems - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsTextTemplatesTextTemplateIdTextItems'(
    parameters?: Parameters<Paths.PostApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.PathParameters> | null,
    data?: Paths.PostApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.Responses.$200>
  /**
   * getApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId - PERMISSION: NO
   */
  'getApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.Responses.$200>
  /**
   * patchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.Responses.$200>
  /**
   * deleteApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.Responses.$200>
  /**
   * getApiV1EnumerationsStationsId - PERMISSION: NO
   */
  'getApiV1EnumerationsStationsId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsStationsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsStationsId.Responses.$200>
  /**
   * patchApiV1EnumerationsStationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsStationsId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsStationsId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsStationsId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsStationsId.Responses.$200>
  /**
   * deleteApiV1EnumerationsStationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsStationsId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsStationsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsStationsId.Responses.$200>
  /**
   * getApiV1EnumerationsStations - PERMISSION: NO
   */
  'getApiV1EnumerationsStations'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsStations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsStations.Responses.$200>
  /**
   * postApiV1EnumerationsStations - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsStations'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsStations.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsStations.Responses.$200>
  /**
   * getApiV1EnumerationsPropertiesId - PERMISSION: NO
   */
  'getApiV1EnumerationsPropertiesId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsPropertiesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsPropertiesId.Responses.$200>
  /**
   * patchApiV1EnumerationsPropertiesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsPropertiesId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsPropertiesId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsPropertiesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsPropertiesId.Responses.$200>
  /**
   * deleteApiV1EnumerationsPropertiesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsPropertiesId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsPropertiesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsPropertiesId.Responses.$200>
  /**
   * getApiV1EnumerationsProperties - PERMISSION: NO
   */
  'getApiV1EnumerationsProperties'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsProperties.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsProperties.Responses.$200>
  /**
   * postApiV1EnumerationsProperties - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsProperties'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsProperties.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsProperties.Responses.$200>
  /**
   * getApiV1EnumerationsSeasons - PERMISSION: NO
   */
  'getApiV1EnumerationsSeasons'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsSeasons.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsSeasons.Responses.$200>
  /**
   * postApiV1EnumerationsSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsSeasons'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsSeasons.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsSeasons.Responses.$200>
  /**
   * getApiV1EnumerationsSeasonsId - PERMISSION: NO
   */
  'getApiV1EnumerationsSeasonsId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsSeasonsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsSeasonsId.Responses.$200>
  /**
   * patchApiV1EnumerationsSeasonsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsSeasonsId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsSeasonsId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsSeasonsId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsSeasonsId.Responses.$200>
  /**
   * deleteApiV1EnumerationsSeasonsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsSeasonsId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsSeasonsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsSeasonsId.Responses.$200>
  /**
   * getApiV1EnumerationsProductTypes - PERMISSION: NO
   */
  'getApiV1EnumerationsProductTypes'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsProductTypes.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsProductTypes.Responses.$200>
  /**
   * postApiV1EnumerationsProductTypes - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsProductTypes'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsProductTypes.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsProductTypes.Responses.$200>
  /**
   * getApiV1EnumerationsProductTypesProductTypeId - PERMISSION: NO
   */
  'getApiV1EnumerationsProductTypesProductTypeId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsProductTypesProductTypeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsProductTypesProductTypeId.Responses.$200>
  /**
   * patchApiV1EnumerationsProductTypesProductTypeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsProductTypesProductTypeId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsProductTypesProductTypeId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsProductTypesProductTypeId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsProductTypesProductTypeId.Responses.$200>
  /**
   * deleteApiV1EnumerationsProductTypesProductTypeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsProductTypesProductTypeId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsProductTypesProductTypeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsProductTypesProductTypeId.Responses.$200>
  /**
   * getApiV1EnumerationsPersonTypes - PERMISSION: NO
   */
  'getApiV1EnumerationsPersonTypes'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsPersonTypes.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsPersonTypes.Responses.$200>
  /**
   * postApiV1EnumerationsPersonTypes - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsPersonTypes'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsPersonTypes.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsPersonTypes.Responses.$200>
  /**
   * getApiV1EnumerationsPersonTypesPersonTypeId - PERMISSION: NO
   */
  'getApiV1EnumerationsPersonTypesPersonTypeId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsPersonTypesPersonTypeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsPersonTypesPersonTypeId.Responses.$200>
  /**
   * patchApiV1EnumerationsPersonTypesPersonTypeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsPersonTypesPersonTypeId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsPersonTypesPersonTypeId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsPersonTypesPersonTypeId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsPersonTypesPersonTypeId.Responses.$200>
  /**
   * deleteApiV1EnumerationsPersonTypesPersonTypeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsPersonTypesPersonTypeId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsPersonTypesPersonTypeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsPersonTypesPersonTypeId.Responses.$200>
  /**
   * getApiV1EnumerationsProductCatalogues - PERMISSION: NO
   */
  'getApiV1EnumerationsProductCatalogues'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsProductCatalogues.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsProductCatalogues.Responses.$200>
  /**
   * postApiV1EnumerationsProductCatalogues - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsProductCatalogues'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsProductCatalogues.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsProductCatalogues.Responses.$200>
  /**
   * getApiV1EnumerationsProductCataloguesProductCatalogueId - PERMISSION: NO
   */
  'getApiV1EnumerationsProductCataloguesProductCatalogueId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsProductCataloguesProductCatalogueId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsProductCataloguesProductCatalogueId.Responses.$200>
  /**
   * patchApiV1EnumerationsProductCataloguesProductCatalogueId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsProductCataloguesProductCatalogueId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsProductCataloguesProductCatalogueId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsProductCataloguesProductCatalogueId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsProductCataloguesProductCatalogueId.Responses.$200>
  /**
   * deleteApiV1EnumerationsProductCataloguesProductCatalogueId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsProductCataloguesProductCatalogueId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsProductCataloguesProductCatalogueId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsProductCataloguesProductCatalogueId.Responses.$200>
  /**
   * getApiV1EnumerationsMealPlans - PERMISSION: NO
   */
  'getApiV1EnumerationsMealPlans'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsMealPlans.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsMealPlans.Responses.$200>
  /**
   * postApiV1EnumerationsMealPlans - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsMealPlans'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsMealPlans.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsMealPlans.Responses.$200>
  /**
   * getApiV1EnumerationsMealPlansId - PERMISSION: NO
   */
  'getApiV1EnumerationsMealPlansId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsMealPlansId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsMealPlansId.Responses.$200>
  /**
   * patchApiV1EnumerationsMealPlansId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsMealPlansId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsMealPlansId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsMealPlansId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsMealPlansId.Responses.$200>
  /**
   * deleteApiV1EnumerationsMealPlansId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsMealPlansId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsMealPlansId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsMealPlansId.Responses.$200>
  /**
   * getApiV1EnumerationsPricelistItems - PERMISSION: NO
   */
  'getApiV1EnumerationsPricelistItems'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsPricelistItems.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsPricelistItems.Responses.$200>
  /**
   * postApiV1EnumerationsPricelistItems - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsPricelistItems'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsPricelistItems.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsPricelistItems.Responses.$200>
  /**
   * getApiV1EnumerationsPricelistItemsId - PERMISSION: NO
   */
  'getApiV1EnumerationsPricelistItemsId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsPricelistItemsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsPricelistItemsId.Responses.$200>
  /**
   * patchApiV1EnumerationsPricelistItemsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsPricelistItemsId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsPricelistItemsId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsPricelistItemsId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsPricelistItemsId.Responses.$200>
  /**
   * deleteApiV1EnumerationsPricelistItemsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsPricelistItemsId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsPricelistItemsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsPricelistItemsId.Responses.$200>
  /**
   * getApiV1EnumerationsPriceGroups - PERMISSION: NO
   */
  'getApiV1EnumerationsPriceGroups'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsPriceGroups.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsPriceGroups.Responses.$200>
  /**
   * postApiV1EnumerationsPriceGroups - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsPriceGroups'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsPriceGroups.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsPriceGroups.Responses.$200>
  /**
   * getApiV1EnumerationsPriceGroupsId - PERMISSION: NO
   */
  'getApiV1EnumerationsPriceGroupsId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsPriceGroupsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsPriceGroupsId.Responses.$200>
  /**
   * patchApiV1EnumerationsPriceGroupsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsPriceGroupsId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsPriceGroupsId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsPriceGroupsId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsPriceGroupsId.Responses.$200>
  /**
   * deleteApiV1EnumerationsPriceGroupsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsPriceGroupsId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsPriceGroupsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsPriceGroupsId.Responses.$200>
  /**
   * getApiV1EnumerationsExchangeRates - PERMISSION: NO
   */
  'getApiV1EnumerationsExchangeRates'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsExchangeRates.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsExchangeRates.Responses.$200>
  /**
   * postApiV1EnumerationsExchangeRates - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsExchangeRates'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsExchangeRates.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsExchangeRates.Responses.$200>
  /**
   * getApiV1EnumerationsExchangeRatesId - PERMISSION: NO
   */
  'getApiV1EnumerationsExchangeRatesId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsExchangeRatesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsExchangeRatesId.Responses.$200>
  /**
   * patchApiV1EnumerationsExchangeRatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsExchangeRatesId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsExchangeRatesId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsExchangeRatesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsExchangeRatesId.Responses.$200>
  /**
   * deleteApiV1EnumerationsExchangeRatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsExchangeRatesId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsExchangeRatesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsExchangeRatesId.Responses.$200>
  /**
   * getApiV1EnumerationsCarriers - PERMISSION: NO
   */
  'getApiV1EnumerationsCarriers'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsCarriers.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsCarriers.Responses.$200>
  /**
   * postApiV1EnumerationsCarriers - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsCarriers'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsCarriers.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsCarriers.Responses.$200>
  /**
   * getApiV1EnumerationsCarriersCarrierId - PERMISSION: NO
   */
  'getApiV1EnumerationsCarriersCarrierId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsCarriersCarrierId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsCarriersCarrierId.Responses.$200>
  /**
   * patchApiV1EnumerationsCarriersCarrierId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsCarriersCarrierId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsCarriersCarrierId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsCarriersCarrierId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsCarriersCarrierId.Responses.$200>
  /**
   * deleteApiV1EnumerationsCarriersCarrierId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsCarriersCarrierId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsCarriersCarrierId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsCarriersCarrierId.Responses.$200>
  /**
   * getApiV1EnumerationsSalesChannels - PERMISSION: NO
   */
  'getApiV1EnumerationsSalesChannels'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsSalesChannels.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsSalesChannels.Responses.$200>
  /**
   * postApiV1EnumerationsSalesChannels - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsSalesChannels'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsSalesChannels.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsSalesChannels.Responses.$200>
  /**
   * getApiV1EnumerationsSalesChannelsSalesChannelId - PERMISSION: NO
   */
  'getApiV1EnumerationsSalesChannelsSalesChannelId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsSalesChannelsSalesChannelId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsSalesChannelsSalesChannelId.Responses.$200>
  /**
   * patchApiV1EnumerationsSalesChannelsSalesChannelId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsSalesChannelsSalesChannelId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsSalesChannelsSalesChannelId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsSalesChannelsSalesChannelId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsSalesChannelsSalesChannelId.Responses.$200>
  /**
   * deleteApiV1EnumerationsSalesChannelsSalesChannelId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsSalesChannelsSalesChannelId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsSalesChannelsSalesChannelId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsSalesChannelsSalesChannelId.Responses.$200>
  /**
   * getApiV1EnumerationsDiscountMarks - PERMISSION: NO
   */
  'getApiV1EnumerationsDiscountMarks'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsDiscountMarks.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsDiscountMarks.Responses.$200>
  /**
   * postApiV1EnumerationsDiscountMarks - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsDiscountMarks'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsDiscountMarks.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsDiscountMarks.Responses.$200>
  /**
   * getApiV1EnumerationsDiscountMarksDiscountMarkId - PERMISSION: NO
   */
  'getApiV1EnumerationsDiscountMarksDiscountMarkId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsDiscountMarksDiscountMarkId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsDiscountMarksDiscountMarkId.Responses.$200>
  /**
   * patchApiV1EnumerationsDiscountMarksDiscountMarkId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsDiscountMarksDiscountMarkId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsDiscountMarksDiscountMarkId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsDiscountMarksDiscountMarkId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsDiscountMarksDiscountMarkId.Responses.$200>
  /**
   * deleteApiV1EnumerationsDiscountMarksDiscountMarkId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsDiscountMarksDiscountMarkId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsDiscountMarksDiscountMarkId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsDiscountMarksDiscountMarkId.Responses.$200>
  /**
   * getApiV1EnumerationsReservationExpirationTimes - PERMISSION: NO
   */
  'getApiV1EnumerationsReservationExpirationTimes'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsReservationExpirationTimes.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsReservationExpirationTimes.Responses.$200>
  /**
   * postApiV1EnumerationsReservationExpirationTimes - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsReservationExpirationTimes'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsReservationExpirationTimes.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsReservationExpirationTimes.Responses.$200>
  /**
   * getApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId - PERMISSION: NO
   */
  'getApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.Responses.$200>
  /**
   * patchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.Responses.$200>
  /**
   * deleteApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.Responses.$200>
  /**
   * getApiV1EnumerationsInsuranceCompanies - PERMISSION: NO
   */
  'getApiV1EnumerationsInsuranceCompanies'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsInsuranceCompanies.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsInsuranceCompanies.Responses.$200>
  /**
   * postApiV1EnumerationsInsuranceCompanies - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsInsuranceCompanies'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsInsuranceCompanies.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsInsuranceCompanies.Responses.$200>
  /**
   * getApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId - PERMISSION: NO
   */
  'getApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.Responses.$200>
  /**
   * patchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.Responses.$200>
  /**
   * deleteApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.Responses.$200>
  /**
   * getApiV1EnumerationsUnitTemplatePropertiesId - PERMISSION: NO
   */
  'getApiV1EnumerationsUnitTemplatePropertiesId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsUnitTemplatePropertiesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsUnitTemplatePropertiesId.Responses.$200>
  /**
   * patchApiV1EnumerationsUnitTemplatePropertiesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsUnitTemplatePropertiesId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsUnitTemplatePropertiesId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsUnitTemplatePropertiesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsUnitTemplatePropertiesId.Responses.$200>
  /**
   * deleteApiV1EnumerationsUnitTemplatePropertiesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsUnitTemplatePropertiesId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsUnitTemplatePropertiesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsUnitTemplatePropertiesId.Responses.$200>
  /**
   * getApiV1EnumerationsUnitTemplateProperties - PERMISSION: NO
   */
  'getApiV1EnumerationsUnitTemplateProperties'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsUnitTemplateProperties.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsUnitTemplateProperties.Responses.$200>
  /**
   * postApiV1EnumerationsUnitTemplateProperties - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsUnitTemplateProperties'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsUnitTemplateProperties.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsUnitTemplateProperties.Responses.$200>
  /**
   * getApiV1UsersSettings - PERMISSION: NO
   */
  'getApiV1UsersSettings'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1UsersSettings.Responses.$200>
  /**
   * patchApiV1UsersSettings - PERMISSION: NO
   */
  'patchApiV1UsersSettings'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PatchApiV1UsersSettings.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1UsersSettings.Responses.$200>
  /**
   * postApiV1UsersConfirm - PERMISSION: NO
   */
  'postApiV1UsersConfirm'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1UsersConfirm.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1UsersConfirm.Responses.$200>
  /**
   * getApiV1Avatar - PERMISSION: NO
   */
  'getApiV1Avatar'(
    parameters?: Parameters<Paths.GetApiV1Avatar.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV1Folders - PERMISSION: NO
   */
  'getApiV1Folders'(
    parameters?: Parameters<Paths.GetApiV1Folders.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * postApiV1Folders - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
   */
  'postApiV1Folders'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Folders.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Folders.Responses.$200>
  /**
   * deleteApiV1Folders - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
   */
  'deleteApiV1Folders'(
    parameters?: Parameters<Paths.DeleteApiV1Folders.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1Folders.Responses.$200>
  /**
   * getApiV1FoldersContent - PERMISSION: NO
   */
  'getApiV1FoldersContent'(
    parameters?: Parameters<Paths.GetApiV1FoldersContent.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1FoldersContent.Responses.$200>
  /**
   * getApiV1FoldersContentFiltered - PERMISSION: NO
   */
  'getApiV1FoldersContentFiltered'(
    parameters?: Parameters<Paths.GetApiV1FoldersContentFiltered.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1FoldersContentFiltered.Responses.$200>
  /**
   * getApiV1FilesId - PERMISSION: NO
   */
  'getApiV1FilesId'(
    parameters?: Parameters<Paths.GetApiV1FilesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1FilesId.Responses.$200>
  /**
   * patchApiV1FilesId - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
   */
  'patchApiV1FilesId'(
    parameters?: Parameters<Paths.PatchApiV1FilesId.PathParameters> | null,
    data?: Paths.PatchApiV1FilesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1FilesId.Responses.$200>
  /**
   * deleteApiV1FilesId - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
   */
  'deleteApiV1FilesId'(
    parameters?: Parameters<Paths.DeleteApiV1FilesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1FilesId.Responses.$200>
  /**
   * getApiV1FilesIdDownload - PERMISSION: NO
   */
  'getApiV1FilesIdDownload'(
    parameters?: Parameters<Paths.GetApiV1FilesIdDownload.PathParameters & Paths.GetApiV1FilesIdDownload.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV1Exports - PERMISSION: NO
   */
  'getApiV1Exports'(
    parameters?: Parameters<Paths.GetApiV1Exports.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV1FileTags - PERMISSION: NO
   */
  'getApiV1FileTags'(
    parameters?: Parameters<Paths.GetApiV1FileTags.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1FileTags.Responses.$200>
  /**
   * getApiV1FileTagFiles - PERMISSION: NO
   */
  'getApiV1FileTagFiles'(
    parameters?: Parameters<Paths.GetApiV1FileTagFiles.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1FileTagFiles.Responses.$200>
  /**
   * postApiV1ProductsPricePgsync - PERMISSION: NO
   */
  'postApiV1ProductsPricePgsync'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1ProductsPricePgsync.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * postApiV1AuthorizationLogin - PERMISSION: NO
   */
  'postApiV1AuthorizationLogin'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1AuthorizationLogin.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1AuthorizationLogin.Responses.$200>
  /**
   * getApiV1StaticPdfsReservations - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'getApiV1StaticPdfsReservations'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV1Static - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION, COMPANIES_BROWSING]
   */
  'getApiV1Static'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * postApiV1AuthorizationLoginAsUser - PERMISSION: [SUPER_ADMIN]
   */
  'postApiV1AuthorizationLoginAsUser'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1AuthorizationLoginAsUser.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1AuthorizationLoginAsUser.Responses.$200>
  /**
   * getApiV1Roles - PERMISSION: [SUPER_ADMIN, ADMIN, USER_LIST]
   */
  'getApiV1Roles'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Roles.Responses.$200>
  /**
   * postApiV1Roles - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'postApiV1Roles'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Roles.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Roles.Responses.$200>
  /**
   * getApiV1RolesRoleId - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'getApiV1RolesRoleId'(
    parameters?: Parameters<Paths.GetApiV1RolesRoleId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1RolesRoleId.Responses.$200>
  /**
   * patchApiV1RolesRoleId - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'patchApiV1RolesRoleId'(
    parameters?: Parameters<Paths.PatchApiV1RolesRoleId.PathParameters> | null,
    data?: Paths.PatchApiV1RolesRoleId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1RolesRoleId.Responses.$200>
  /**
   * deleteApiV1RolesRoleId - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'deleteApiV1RolesRoleId'(
    parameters?: Parameters<Paths.DeleteApiV1RolesRoleId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1RolesRoleId.Responses.$200>
  /**
   * getApiV1RolesRoleIdAvailableUsers - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'getApiV1RolesRoleIdAvailableUsers'(
    parameters?: Parameters<Paths.GetApiV1RolesRoleIdAvailableUsers.PathParameters & Paths.GetApiV1RolesRoleIdAvailableUsers.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1RolesRoleIdAvailableUsers.Responses.$200>
  /**
   * postApiV1RolesRoleIdAssignUsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'postApiV1RolesRoleIdAssignUsersUserId'(
    parameters?: Parameters<Paths.PostApiV1RolesRoleIdAssignUsersUserId.PathParameters> | null,
    data?: Paths.PostApiV1RolesRoleIdAssignUsersUserId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1RolesRoleIdAssignUsersUserId.Responses.$200>
  /**
   * patchApiV1RolesRoleIdSetPermissions - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'patchApiV1RolesRoleIdSetPermissions'(
    parameters?: Parameters<Paths.PatchApiV1RolesRoleIdSetPermissions.PathParameters> | null,
    data?: Paths.PatchApiV1RolesRoleIdSetPermissions.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1RolesRoleIdSetPermissions.Responses.$200>
  /**
   * deleteApiV1RolesRoleIdUnassignUsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'deleteApiV1RolesRoleIdUnassignUsersUserId'(
    parameters?: Parameters<Paths.DeleteApiV1RolesRoleIdUnassignUsersUserId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1RolesRoleIdUnassignUsersUserId.Responses.$200>
  /**
   * patchApiV1EnumerationsPropertiesIdReorder - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
   */
  'patchApiV1EnumerationsPropertiesIdReorder'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsPropertiesIdReorder.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsPropertiesIdReorder.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsPropertiesIdReorder.Responses.$200>
  /**
   * patchApiV1EnumerationsPersonTypesPersonTypeIdReorder - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsPersonTypesPersonTypeIdReorder'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsPersonTypesPersonTypeIdReorder.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsPersonTypesPersonTypeIdReorder.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsPersonTypesPersonTypeIdReorder.Responses.$200>
  /**
   * getApiV1EnumerationsDepositAmounts - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'getApiV1EnumerationsDepositAmounts'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsDepositAmounts.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsDepositAmounts.Responses.$200>
  /**
   * postApiV1EnumerationsDepositAmounts - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'postApiV1EnumerationsDepositAmounts'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1EnumerationsDepositAmounts.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1EnumerationsDepositAmounts.Responses.$200>
  /**
   * getApiV1EnumerationsDepositAmountsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'getApiV1EnumerationsDepositAmountsId'(
    parameters?: Parameters<Paths.GetApiV1EnumerationsDepositAmountsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1EnumerationsDepositAmountsId.Responses.$200>
  /**
   * patchApiV1EnumerationsDepositAmountsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'patchApiV1EnumerationsDepositAmountsId'(
    parameters?: Parameters<Paths.PatchApiV1EnumerationsDepositAmountsId.PathParameters> | null,
    data?: Paths.PatchApiV1EnumerationsDepositAmountsId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1EnumerationsDepositAmountsId.Responses.$200>
  /**
   * deleteApiV1EnumerationsDepositAmountsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
   */
  'deleteApiV1EnumerationsDepositAmountsId'(
    parameters?: Parameters<Paths.DeleteApiV1EnumerationsDepositAmountsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1EnumerationsDepositAmountsId.Responses.$200>
  /**
   * getApiV1Users - PERMISSION: [SUPER_ADMIN, ADMIN, USER_LIST, BUSINESS_CASES_BROWSING]
   */
  'getApiV1Users'(
    parameters?: Parameters<Paths.GetApiV1Users.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Users.Responses.$200>
  /**
   * postApiV1Users - PERMISSION: [SUPER_ADMIN, ADMIN, USER_CREATE]
   */
  'postApiV1Users'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Users.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Users.Responses.$200>
  /**
   * getApiV1UsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT, USER_LIST]
   */
  'getApiV1UsersUserId'(
    parameters?: Parameters<Paths.GetApiV1UsersUserId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1UsersUserId.Responses.$200>
  /**
   * patchApiV1UsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
   */
  'patchApiV1UsersUserId'(
    parameters?: Parameters<Paths.PatchApiV1UsersUserId.PathParameters> | null,
    data?: Paths.PatchApiV1UsersUserId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1UsersUserId.Responses.$200>
  /**
   * deleteApiV1UsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_DELETE]
   */
  'deleteApiV1UsersUserId'(
    parameters?: Parameters<Paths.DeleteApiV1UsersUserId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1UsersUserId.Responses.$200>
  /**
   * postApiV1UsersUserIdAssignRoles - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'postApiV1UsersUserIdAssignRoles'(
    parameters?: Parameters<Paths.PostApiV1UsersUserIdAssignRoles.PathParameters> | null,
    data?: Paths.PostApiV1UsersUserIdAssignRoles.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1UsersUserIdAssignRoles.Responses.$200>
  /**
   * patchApiV1UsersUserIdSetPermissions - PERMISSION: [SUPER_ADMIN, ADMIN]
   */
  'patchApiV1UsersUserIdSetPermissions'(
    parameters?: Parameters<Paths.PatchApiV1UsersUserIdSetPermissions.PathParameters> | null,
    data?: Paths.PatchApiV1UsersUserIdSetPermissions.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1UsersUserIdSetPermissions.Responses.$200>
  /**
   * patchApiV1UsersUserIdResendRegistrationEmail - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
   */
  'patchApiV1UsersUserIdResendRegistrationEmail'(
    parameters?: Parameters<Paths.PatchApiV1UsersUserIdResendRegistrationEmail.PathParameters> | null,
    data?: Paths.PatchApiV1UsersUserIdResendRegistrationEmail.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1UsersUserIdResendRegistrationEmail.Responses.$200>
  /**
   * patchApiV1UsersUserIdSendResetPasswordEmail - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
   */
  'patchApiV1UsersUserIdSendResetPasswordEmail'(
    parameters?: Parameters<Paths.PatchApiV1UsersUserIdSendResetPasswordEmail.PathParameters> | null,
    data?: Paths.PatchApiV1UsersUserIdSendResetPasswordEmail.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1UsersUserIdSendResetPasswordEmail.Responses.$200>
  /**
   * getApiV1Destinations - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_BROWSING, FACILITY_BROWSING, TRANSPORTATION_BROWSING, PRODUCT_BROWSING, DISCOUNT_BROWSING, ENUMS_DEFINITION]
   */
  'getApiV1Destinations'(
    parameters?: Parameters<Paths.GetApiV1Destinations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Destinations.Responses.$200>
  /**
   * postApiV1Destinations - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
   */
  'postApiV1Destinations'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Destinations.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Destinations.Responses.$200>
  /**
   * getApiV1DestinationsDestinationId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT, ENUMS_DEFINITION, DESTINATION_BROWSING]
   */
  'getApiV1DestinationsDestinationId'(
    parameters?: Parameters<Paths.GetApiV1DestinationsDestinationId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationsDestinationId.Responses.$200>
  /**
   * patchApiV1DestinationsDestinationId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
   */
  'patchApiV1DestinationsDestinationId'(
    parameters?: Parameters<Paths.PatchApiV1DestinationsDestinationId.PathParameters> | null,
    data?: Paths.PatchApiV1DestinationsDestinationId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1DestinationsDestinationId.Responses.$200>
  /**
   * deleteApiV1DestinationsDestinationId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
   */
  'deleteApiV1DestinationsDestinationId'(
    parameters?: Parameters<Paths.DeleteApiV1DestinationsDestinationId.PathParameters & Paths.DeleteApiV1DestinationsDestinationId.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1DestinationsDestinationId.Responses.$200>
  /**
   * getApiV1DestinationsDestinationIdTextItems - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT, DESTINATION_BROWSING]
   */
  'getApiV1DestinationsDestinationIdTextItems'(
    parameters?: Parameters<Paths.GetApiV1DestinationsDestinationIdTextItems.PathParameters & Paths.GetApiV1DestinationsDestinationIdTextItems.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationsDestinationIdTextItems.Responses.$200>
  /**
   * patchApiV1DestinationsDestinationIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
   */
  'patchApiV1DestinationsDestinationIdTextItemsTextItemId'(
    parameters?: Parameters<Paths.PatchApiV1DestinationsDestinationIdTextItemsTextItemId.PathParameters & Paths.PatchApiV1DestinationsDestinationIdTextItemsTextItemId.QueryParameters> | null,
    data?: Paths.PatchApiV1DestinationsDestinationIdTextItemsTextItemId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1DestinationsDestinationIdTextItemsTextItemId.Responses.$200>
  /**
   * getApiV1DestinationsDestinationIdGallery - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_BROWSING]
   */
  'getApiV1DestinationsDestinationIdGallery'(
    parameters?: Parameters<Paths.GetApiV1DestinationsDestinationIdGallery.PathParameters & Paths.GetApiV1DestinationsDestinationIdGallery.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationsDestinationIdGallery.Responses.$200>
  /**
   * postApiV1DestinationsDestinationIdGalleryAssignImages - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
   */
  'postApiV1DestinationsDestinationIdGalleryAssignImages'(
    parameters?: Parameters<Paths.PostApiV1DestinationsDestinationIdGalleryAssignImages.PathParameters> | null,
    data?: Paths.PostApiV1DestinationsDestinationIdGalleryAssignImages.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1DestinationsDestinationIdGalleryAssignImages.Responses.$200>
  /**
   * patchApiV1DestinationsDestinationIdGalleryReorderImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
   */
  'patchApiV1DestinationsDestinationIdGalleryReorderImagesFileId'(
    parameters?: Parameters<Paths.PatchApiV1DestinationsDestinationIdGalleryReorderImagesFileId.PathParameters & Paths.PatchApiV1DestinationsDestinationIdGalleryReorderImagesFileId.QueryParameters> | null,
    data?: Paths.PatchApiV1DestinationsDestinationIdGalleryReorderImagesFileId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1DestinationsDestinationIdGalleryReorderImagesFileId.Responses.$200>
  /**
   * deleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
   */
  'deleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId'(
    parameters?: Parameters<Paths.DeleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId.PathParameters & Paths.DeleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId.Responses.$200>
  /**
   * getApiV1Facilities - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_BROWSING, PRODUCT_BROWSING]
   */
  'getApiV1Facilities'(
    parameters?: Parameters<Paths.GetApiV1Facilities.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Facilities.Responses.$200>
  /**
   * postApiV1Facilities - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'postApiV1Facilities'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Facilities.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Facilities.Responses.$200>
  /**
   * getApiV1FacilitiesFacilityId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT, FACILITY_BROWSING, SALES]
   */
  'getApiV1FacilitiesFacilityId'(
    parameters?: Parameters<Paths.GetApiV1FacilitiesFacilityId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1FacilitiesFacilityId.Responses.$200>
  /**
   * patchApiV1FacilitiesFacilityId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'patchApiV1FacilitiesFacilityId'(
    parameters?: Parameters<Paths.PatchApiV1FacilitiesFacilityId.PathParameters> | null,
    data?: Paths.PatchApiV1FacilitiesFacilityId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1FacilitiesFacilityId.Responses.$200>
  /**
   * deleteApiV1FacilitiesFacilityId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'deleteApiV1FacilitiesFacilityId'(
    parameters?: Parameters<Paths.DeleteApiV1FacilitiesFacilityId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1FacilitiesFacilityId.Responses.$200>
  /**
   * getApiV1FacilitiesFacilityIdUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_BROWSING, PRODUCT_BROWSING]
   */
  'getApiV1FacilitiesFacilityIdUnitTemplates'(
    parameters?: Parameters<Paths.GetApiV1FacilitiesFacilityIdUnitTemplates.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1FacilitiesFacilityIdUnitTemplates.Responses.$200>
  /**
   * postApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'postApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId'(
    parameters?: Parameters<Paths.PostApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.PathParameters> | null,
    data?: Paths.PostApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.Responses.$200>
  /**
   * patchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'patchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId'(
    parameters?: Parameters<Paths.PatchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.PathParameters> | null,
    data?: Paths.PatchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.Responses.$200>
  /**
   * deleteApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'deleteApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId'(
    parameters?: Parameters<Paths.DeleteApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.Responses.$200>
  /**
   * getApiV1FacilitiesFacilityIdGallery - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_BROWSING]
   */
  'getApiV1FacilitiesFacilityIdGallery'(
    parameters?: Parameters<Paths.GetApiV1FacilitiesFacilityIdGallery.PathParameters & Paths.GetApiV1FacilitiesFacilityIdGallery.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1FacilitiesFacilityIdGallery.Responses.$200>
  /**
   * postApiV1FacilitiesFacilityIdGalleryAssignImages - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'postApiV1FacilitiesFacilityIdGalleryAssignImages'(
    parameters?: Parameters<Paths.PostApiV1FacilitiesFacilityIdGalleryAssignImages.PathParameters> | null,
    data?: Paths.PostApiV1FacilitiesFacilityIdGalleryAssignImages.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1FacilitiesFacilityIdGalleryAssignImages.Responses.$200>
  /**
   * patchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'patchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId'(
    parameters?: Parameters<Paths.PatchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId.PathParameters & Paths.PatchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId.QueryParameters> | null,
    data?: Paths.PatchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId.Responses.$200>
  /**
   * deleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'deleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId'(
    parameters?: Parameters<Paths.DeleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId.PathParameters & Paths.DeleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId.Responses.$200>
  /**
   * getApiV1FacilitiesFacilityIdFacilityPropertyCategories - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_BROWSING, PRODUCT_BROWSING]
   */
  'getApiV1FacilitiesFacilityIdFacilityPropertyCategories'(
    parameters?: Parameters<Paths.GetApiV1FacilitiesFacilityIdFacilityPropertyCategories.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1FacilitiesFacilityIdFacilityPropertyCategories.Responses.$200>
  /**
   * patchApiV1FacilitiesFacilityIdFacilityPropertyCategories - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
   */
  'patchApiV1FacilitiesFacilityIdFacilityPropertyCategories'(
    parameters?: Parameters<Paths.PatchApiV1FacilitiesFacilityIdFacilityPropertyCategories.PathParameters> | null,
    data?: Paths.PatchApiV1FacilitiesFacilityIdFacilityPropertyCategories.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1FacilitiesFacilityIdFacilityPropertyCategories.Responses.$200>
  /**
   * postApiV1Files - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT, ENUMS_DEFINITION, COMPANIES_EDIT, INSURANCE_EDIT]
   */
  'postApiV1Files'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Files.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Files.Responses.$200>
  /**
   * patchApiV1FilesFileIdSetTags - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
   */
  'patchApiV1FilesFileIdSetTags'(
    parameters?: Parameters<Paths.PatchApiV1FilesFileIdSetTags.PathParameters> | null,
    data?: Paths.PatchApiV1FilesFileIdSetTags.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1FilesFileIdSetTags.Responses.$200>
  /**
   * getApiV1Lines - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING]
   */
  'getApiV1Lines'(
    parameters?: Parameters<Paths.GetApiV1Lines.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Lines.Responses.$200>
  /**
   * postApiV1Lines - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'postApiV1Lines'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Lines.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Lines.Responses.$200>
  /**
   * getApiV1LinesLineId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING, SALES]
   */
  'getApiV1LinesLineId'(
    parameters?: Parameters<Paths.GetApiV1LinesLineId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineId.Responses.$200>
  /**
   * patchApiV1LinesLineId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'patchApiV1LinesLineId'(
    parameters?: Parameters<Paths.PatchApiV1LinesLineId.PathParameters> | null,
    data?: Paths.PatchApiV1LinesLineId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesLineId.Responses.$200>
  /**
   * deleteApiV1LinesLineId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'deleteApiV1LinesLineId'(
    parameters?: Parameters<Paths.DeleteApiV1LinesLineId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1LinesLineId.Responses.$200>
  /**
   * getApiV1LinesLineIdTermsWithTermStations - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING]
   */
  'getApiV1LinesLineIdTermsWithTermStations'(
    parameters?: Parameters<Paths.GetApiV1LinesLineIdTermsWithTermStations.PathParameters & Paths.GetApiV1LinesLineIdTermsWithTermStations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineIdTermsWithTermStations.Responses.$200>
  /**
   * getApiV1LinesLineIdStations - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING, SALES]
   */
  'getApiV1LinesLineIdStations'(
    parameters?: Parameters<Paths.GetApiV1LinesLineIdStations.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineIdStations.Responses.$200>
  /**
   * getApiV1LinesLineIdStationsUnassigned - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING]
   */
  'getApiV1LinesLineIdStationsUnassigned'(
    parameters?: Parameters<Paths.GetApiV1LinesLineIdStationsUnassigned.PathParameters & Paths.GetApiV1LinesLineIdStationsUnassigned.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineIdStationsUnassigned.Responses.$200>
  /**
   * postApiV1LinesLineIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'postApiV1LinesLineIdStationsStationId'(
    parameters?: Parameters<Paths.PostApiV1LinesLineIdStationsStationId.PathParameters> | null,
    data?: Paths.PostApiV1LinesLineIdStationsStationId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1LinesLineIdStationsStationId.Responses.$200>
  /**
   * patchApiV1LinesLineIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'patchApiV1LinesLineIdStationsStationId'(
    parameters?: Parameters<Paths.PatchApiV1LinesLineIdStationsStationId.PathParameters> | null,
    data?: Paths.PatchApiV1LinesLineIdStationsStationId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesLineIdStationsStationId.Responses.$200>
  /**
   * deleteApiV1LinesLineIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'deleteApiV1LinesLineIdStationsStationId'(
    parameters?: Parameters<Paths.DeleteApiV1LinesLineIdStationsStationId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1LinesLineIdStationsStationId.Responses.$200>
  /**
   * patchApiV1LinesLineIdStationsStationIdReorder - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'patchApiV1LinesLineIdStationsStationIdReorder'(
    parameters?: Parameters<Paths.PatchApiV1LinesLineIdStationsStationIdReorder.PathParameters> | null,
    data?: Paths.PatchApiV1LinesLineIdStationsStationIdReorder.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesLineIdStationsStationIdReorder.Responses.$200>
  /**
   * getApiV1LinesLineIdTermsTermIdStations - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING, SALES]
   */
  'getApiV1LinesLineIdTermsTermIdStations'(
    parameters?: Parameters<Paths.GetApiV1LinesLineIdTermsTermIdStations.PathParameters & Paths.GetApiV1LinesLineIdTermsTermIdStations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineIdTermsTermIdStations.Responses.$200>
  /**
   * deleteApiV1LinesLineIdTermsTermIdStations - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'deleteApiV1LinesLineIdTermsTermIdStations'(
    parameters?: Parameters<Paths.DeleteApiV1LinesLineIdTermsTermIdStations.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1LinesLineIdTermsTermIdStations.Responses.$200>
  /**
   * getApiV1LinesLineIdTermsTermIdStationsWithDatetimes - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING, SALES]
   */
  'getApiV1LinesLineIdTermsTermIdStationsWithDatetimes'(
    parameters?: Parameters<Paths.GetApiV1LinesLineIdTermsTermIdStationsWithDatetimes.PathParameters & Paths.GetApiV1LinesLineIdTermsTermIdStationsWithDatetimes.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineIdTermsTermIdStationsWithDatetimes.Responses.$200>
  /**
   * getApiV1LinesLineIdTermsTermIdStationsUnassigned - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING]
   */
  'getApiV1LinesLineIdTermsTermIdStationsUnassigned'(
    parameters?: Parameters<Paths.GetApiV1LinesLineIdTermsTermIdStationsUnassigned.PathParameters & Paths.GetApiV1LinesLineIdTermsTermIdStationsUnassigned.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineIdTermsTermIdStationsUnassigned.Responses.$200>
  /**
   * postApiV1LinesLineIdTermsTermIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'postApiV1LinesLineIdTermsTermIdStationsStationId'(
    parameters?: Parameters<Paths.PostApiV1LinesLineIdTermsTermIdStationsStationId.PathParameters> | null,
    data?: Paths.PostApiV1LinesLineIdTermsTermIdStationsStationId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1LinesLineIdTermsTermIdStationsStationId.Responses.$200>
  /**
   * patchApiV1LinesLineIdTermsTermIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'patchApiV1LinesLineIdTermsTermIdStationsStationId'(
    parameters?: Parameters<Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationId.PathParameters> | null,
    data?: Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationId.Responses.$200>
  /**
   * deleteApiV1LinesLineIdTermsTermIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'deleteApiV1LinesLineIdTermsTermIdStationsStationId'(
    parameters?: Parameters<Paths.DeleteApiV1LinesLineIdTermsTermIdStationsStationId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1LinesLineIdTermsTermIdStationsStationId.Responses.$200>
  /**
   * patchApiV1LinesLineIdTermsTermIdStationsStationIdReorder - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'patchApiV1LinesLineIdTermsTermIdStationsStationIdReorder'(
    parameters?: Parameters<Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationIdReorder.PathParameters> | null,
    data?: Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationIdReorder.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationIdReorder.Responses.$200>
  /**
   * getApiV1LinesLineIdUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING]
   */
  'getApiV1LinesLineIdUnitTemplates'(
    parameters?: Parameters<Paths.GetApiV1LinesLineIdUnitTemplates.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineIdUnitTemplates.Responses.$200>
  /**
   * postApiV1LinesLineIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'postApiV1LinesLineIdUnitTemplatesUnitTemplateId'(
    parameters?: Parameters<Paths.PostApiV1LinesLineIdUnitTemplatesUnitTemplateId.PathParameters> | null,
    data?: Paths.PostApiV1LinesLineIdUnitTemplatesUnitTemplateId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1LinesLineIdUnitTemplatesUnitTemplateId.Responses.$200>
  /**
   * patchApiV1LinesLineIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'patchApiV1LinesLineIdUnitTemplatesUnitTemplateId'(
    parameters?: Parameters<Paths.PatchApiV1LinesLineIdUnitTemplatesUnitTemplateId.PathParameters> | null,
    data?: Paths.PatchApiV1LinesLineIdUnitTemplatesUnitTemplateId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesLineIdUnitTemplatesUnitTemplateId.Responses.$200>
  /**
   * deleteApiV1LinesLineIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'deleteApiV1LinesLineIdUnitTemplatesUnitTemplateId'(
    parameters?: Parameters<Paths.DeleteApiV1LinesLineIdUnitTemplatesUnitTemplateId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1LinesLineIdUnitTemplatesUnitTemplateId.Responses.$200>
  /**
   * getApiV1LinesLineIdRoads - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, PRODUCT_BROWSING, TRANSPORTATION_BROWSING]
   */
  'getApiV1LinesLineIdRoads'(
    parameters?: Parameters<Paths.GetApiV1LinesLineIdRoads.PathParameters & Paths.GetApiV1LinesLineIdRoads.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineIdRoads.Responses.$200>
  /**
   * postApiV1LinesRoadsRoadTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1LinesRoadsRoadTerms'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1LinesRoadsRoadTerms.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1LinesRoadsRoadTerms.Responses.$200>
  /**
   * patchApiV1LinesRoadsRoadTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1LinesRoadsRoadTerms'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PatchApiV1LinesRoadsRoadTerms.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesRoadsRoadTerms.Responses.$200>
  /**
   * getApiV1LinesRoadsRoadId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING]
   */
  'getApiV1LinesRoadsRoadId'(
    parameters?: Parameters<Paths.GetApiV1LinesRoadsRoadId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesRoadsRoadId.Responses.$200>
  /**
   * patchApiV1LinesRoadsRoadId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, PRODUCT_EDIT]
   */
  'patchApiV1LinesRoadsRoadId'(
    parameters?: Parameters<Paths.PatchApiV1LinesRoadsRoadId.PathParameters> | null,
    data?: Paths.PatchApiV1LinesRoadsRoadId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesRoadsRoadId.Responses.$200>
  /**
   * deleteApiV1LinesRoadsRoadId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'deleteApiV1LinesRoadsRoadId'(
    parameters?: Parameters<Paths.DeleteApiV1LinesRoadsRoadId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1LinesRoadsRoadId.Responses.$200>
  /**
   * postApiV1LinesRoads - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'postApiV1LinesRoads'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1LinesRoads.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1LinesRoads.Responses.$200>
  /**
   * postApiV1LinesRoadsGenerateRoads - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1LinesRoadsGenerateRoads'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1LinesRoadsGenerateRoads.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1LinesRoadsGenerateRoads.Responses.$200>
  /**
   * patchApiV1LinesRoadsBulk - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, PRODUCT_EDIT]
   */
  'patchApiV1LinesRoadsBulk'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PatchApiV1LinesRoadsBulk.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesRoadsBulk.Responses.$200>
  /**
   * getApiV1LinesLineIdTextItems - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING]
   */
  'getApiV1LinesLineIdTextItems'(
    parameters?: Parameters<Paths.GetApiV1LinesLineIdTextItems.PathParameters & Paths.GetApiV1LinesLineIdTextItems.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1LinesLineIdTextItems.Responses.$200>
  /**
   * patchApiV1LinesLineIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
   */
  'patchApiV1LinesLineIdTextItemsTextItemId'(
    parameters?: Parameters<Paths.PatchApiV1LinesLineIdTextItemsTextItemId.PathParameters & Paths.PatchApiV1LinesLineIdTextItemsTextItemId.QueryParameters> | null,
    data?: Paths.PatchApiV1LinesLineIdTextItemsTextItemId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1LinesLineIdTextItemsTextItemId.Responses.$200>
  /**
   * deleteApiV1FileTagsId - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
   */
  'deleteApiV1FileTagsId'(
    parameters?: Parameters<Paths.DeleteApiV1FileTagsId.PathParameters & Paths.DeleteApiV1FileTagsId.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1FileTagsId.Responses.$200>
  /**
   * getApiV1TermSerialsTermSerialIdTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1TermSerialsTermSerialIdTerms'(
    parameters?: Parameters<Paths.GetApiV1TermSerialsTermSerialIdTerms.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1TermSerialsTermSerialIdTerms.Responses.$200>
  /**
   * postApiV1TermSerialsTermSerialIdTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1TermSerialsTermSerialIdTerms'(
    parameters?: Parameters<Paths.PostApiV1TermSerialsTermSerialIdTerms.PathParameters> | null,
    data?: Paths.PostApiV1TermSerialsTermSerialIdTerms.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1TermSerialsTermSerialIdTerms.Responses.$200>
  /**
   * getApiV1TermSerialsTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT, TRANSPORTATION_BROWSING]
   */
  'getApiV1TermSerialsTerms'(
    parameters?: Parameters<Paths.GetApiV1TermSerialsTerms.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1TermSerialsTerms.Responses.$200>
  /**
   * patchApiV1TermSerialsTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1TermSerialsTerms'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PatchApiV1TermSerialsTerms.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1TermSerialsTerms.Responses.$200>
  /**
   * deleteApiV1TermSerialsTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'deleteApiV1TermSerialsTerms'(
    parameters?: Parameters<Paths.DeleteApiV1TermSerialsTerms.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1TermSerialsTerms.Responses.$200>
  /**
   * postApiV1TermSerialsTermsGenerate - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1TermSerialsTermsGenerate'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1TermSerialsTermsGenerate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1TermSerialsTermsGenerate.Responses.$200>
  /**
   * getApiV1TermSerials - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1TermSerials'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1TermSerials.Responses.$200>
  /**
   * postApiV1TermSerials - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1TermSerials'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1TermSerials.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1TermSerials.Responses.$200>
  /**
   * getApiV1TermSerialsId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1TermSerialsId'(
    parameters?: Parameters<Paths.GetApiV1TermSerialsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1TermSerialsId.Responses.$200>
  /**
   * patchApiV1TermSerialsId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1TermSerialsId'(
    parameters?: Parameters<Paths.PatchApiV1TermSerialsId.PathParameters> | null,
    data?: Paths.PatchApiV1TermSerialsId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1TermSerialsId.Responses.$200>
  /**
   * deleteApiV1TermSerialsId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'deleteApiV1TermSerialsId'(
    parameters?: Parameters<Paths.DeleteApiV1TermSerialsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1TermSerialsId.Responses.$200>
  /**
   * getApiV1TermSerialsDestinationSeasonsDestinationSeasonId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1TermSerialsDestinationSeasonsDestinationSeasonId'(
    parameters?: Parameters<Paths.GetApiV1TermSerialsDestinationSeasonsDestinationSeasonId.PathParameters & Paths.GetApiV1TermSerialsDestinationSeasonsDestinationSeasonId.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1TermSerialsDestinationSeasonsDestinationSeasonId.Responses.$200>
  /**
   * getApiV1DestinationSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING, DISCOUNT_BROWSING]
   */
  'getApiV1DestinationSeasons'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasons.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasons.Responses.$200>
  /**
   * postApiV1DestinationSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1DestinationSeasons'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1DestinationSeasons.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1DestinationSeasons.Responses.$200>
  /**
   * getApiV1DestinationSeasonsExport - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT, PRODUCT_BROWSING]
   */
  'getApiV1DestinationSeasonsExport'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsExport.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV1DestinationSeasonsDestinationSeasonId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT, PRODUCT_BROWSING]
   */
  'getApiV1DestinationSeasonsDestinationSeasonId'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonId.Responses.$200>
  /**
   * patchApiV1DestinationSeasonsDestinationSeasonId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1DestinationSeasonsDestinationSeasonId'(
    parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonId.PathParameters> | null,
    data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonId.Responses.$200>
  /**
   * deleteApiV1DestinationSeasonsDestinationSeasonId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'deleteApiV1DestinationSeasonsDestinationSeasonId'(
    parameters?: Parameters<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonId.Responses.$200>
  /**
   * getApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT, PRODUCT_BROWSING]
   */
  'getApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices.PathParameters & Paths.GetApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices.Responses.$200>
  /**
   * getApiV1DestinationSeasonsDestinationSeasonIdErrors - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'getApiV1DestinationSeasonsDestinationSeasonIdErrors'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdErrors.PathParameters & Paths.GetApiV1DestinationSeasonsDestinationSeasonIdErrors.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdErrors.Responses.$200>
  /**
   * getApiV1DestinationSeasonsDestinationSeasonIdWarnings - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'getApiV1DestinationSeasonsDestinationSeasonIdWarnings'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdWarnings.PathParameters & Paths.GetApiV1DestinationSeasonsDestinationSeasonIdWarnings.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdWarnings.Responses.$200>
  /**
   * getApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.PathParameters & Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.Responses.$200>
  /**
   * postApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems'(
    parameters?: Parameters<Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.PathParameters> | null,
    data?: Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.Responses.$200>
  /**
   * getApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING, PRODUCT_EDIT]
   */
  'getApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.Responses.$200>
  /**
   * patchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId'(
    parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.PathParameters> | null,
    data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.Responses.$200>
  /**
   * deleteApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'deleteApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId'(
    parameters?: Parameters<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.Responses.$200>
  /**
   * getApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.Responses.$200>
  /**
   * patchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'patchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons'(
    parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.PathParameters> | null,
    data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.Responses.$200>
  /**
   * getApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING, PRODUCT_EDIT]
   */
  'getApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.Responses.$200>
  /**
   * patchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId'(
    parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.PathParameters> | null,
    data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.Responses.$200>
  /**
   * deleteApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'deleteApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId'(
    parameters?: Parameters<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.Responses.$200>
  /**
   * postApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances'(
    parameters?: Parameters<Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances.PathParameters> | null,
    data?: Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances.Responses.$200>
  /**
   * getApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons'(
    parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.Responses.$200>
  /**
   * patchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'patchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons'(
    parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.PathParameters> | null,
    data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.Responses.$200>
  /**
   * getApiV1ServicesServiceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1ServicesServiceId'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceId.Responses.$200>
  /**
   * patchApiV1ServicesServiceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceId'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceId.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceId.Responses.$200>
  /**
   * deleteApiV1ServicesServiceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'deleteApiV1ServicesServiceId'(
    parameters?: Parameters<Paths.DeleteApiV1ServicesServiceId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1ServicesServiceId.Responses.$200>
  /**
   * getApiV1ServicesServiceIdAvailableTermNights - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'getApiV1ServicesServiceIdAvailableTermNights'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdAvailableTermNights.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdAvailableTermNights.Responses.$200>
  /**
   * getApiV1ServicesServiceIdMealPlans - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'getApiV1ServicesServiceIdMealPlans'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdMealPlans.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdMealPlans.Responses.$200>
  /**
   * postApiV1Services - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1Services'(
    parameters?: Parameters<Paths.PostApiV1Services.QueryParameters> | null,
    data?: Paths.PostApiV1Services.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Services.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdApplyPriceAndCostCalculations - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdApplyPriceAndCostCalculations'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdApplyPriceAndCostCalculations.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdApplyPriceAndCostCalculations.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdApplyPriceAndCostCalculations.Responses.$200>
  /**
   * getApiV1ServicesServiceIdUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1ServicesServiceIdUnitTemplates'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplates.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplates.Responses.$200>
  /**
   * postApiV1ServicesServiceIdUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1ServicesServiceIdUnitTemplates'(
    parameters?: Parameters<Paths.PostApiV1ServicesServiceIdUnitTemplates.PathParameters> | null,
    data?: Paths.PostApiV1ServicesServiceIdUnitTemplates.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1ServicesServiceIdUnitTemplates.Responses.$200>
  /**
   * deleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'deleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateId'(
    parameters?: Parameters<Paths.DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateId.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId.Responses.$200>
  /**
   * deleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'deleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemId'(
    parameters?: Parameters<Paths.DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemId.Responses.$200>
  /**
   * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsCostSeasonsReference - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsCostSeasonsReference'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsCostSeasonsReference.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsCostSeasonsReference.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk.Responses.$200>
  /**
   * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.Responses.$200>
  /**
   * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity.PathParameters & Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity.QueryParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk.PathParameters & Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk.QueryParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk.Responses.$200>
  /**
   * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_BROWSING, PRODUCT_BROWSING]
   */
  'getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT, PRODUCT_BROWSING]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT, PRODUCT_BROWSING]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote.Responses.$200>
  /**
   * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.Responses.$200>
  /**
   * postApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId'(
    parameters?: Parameters<Paths.PostApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId.PathParameters> | null,
    data?: Paths.PostApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId.Responses.$200>
  /**
   * postApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId'(
    parameters?: Parameters<Paths.PostApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId.PathParameters> | null,
    data?: Paths.PostApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId.Responses.$200>
  /**
   * getApiV1ServicesServiceIdGallery - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
   */
  'getApiV1ServicesServiceIdGallery'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdGallery.PathParameters & Paths.GetApiV1ServicesServiceIdGallery.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdGallery.Responses.$200>
  /**
   * postApiV1ServicesServiceIdGalleryAssignImages - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'postApiV1ServicesServiceIdGalleryAssignImages'(
    parameters?: Parameters<Paths.PostApiV1ServicesServiceIdGalleryAssignImages.PathParameters> | null,
    data?: Paths.PostApiV1ServicesServiceIdGalleryAssignImages.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1ServicesServiceIdGalleryAssignImages.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdGalleryReorderImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdGalleryReorderImagesFileId'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdGalleryReorderImagesFileId.PathParameters & Paths.PatchApiV1ServicesServiceIdGalleryReorderImagesFileId.QueryParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdGalleryReorderImagesFileId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdGalleryReorderImagesFileId.Responses.$200>
  /**
   * deleteApiV1ServicesServiceIdGalleryUnassignImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'deleteApiV1ServicesServiceIdGalleryUnassignImagesFileId'(
    parameters?: Parameters<Paths.DeleteApiV1ServicesServiceIdGalleryUnassignImagesFileId.PathParameters & Paths.DeleteApiV1ServicesServiceIdGalleryUnassignImagesFileId.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1ServicesServiceIdGalleryUnassignImagesFileId.Responses.$200>
  /**
   * getApiV1ServicesServiceIdTextItems - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'getApiV1ServicesServiceIdTextItems'(
    parameters?: Parameters<Paths.GetApiV1ServicesServiceIdTextItems.PathParameters & Paths.GetApiV1ServicesServiceIdTextItems.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ServicesServiceIdTextItems.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdTextItemsTextItemId'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdTextItemsTextItemId.PathParameters & Paths.PatchApiV1ServicesServiceIdTextItemsTextItemId.QueryParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdTextItemsTextItemId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdTextItemsTextItemId.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk.Responses.$200>
  /**
   * patchApiV1ServicesServiceIdTermsTermIdPriceGroups - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
   */
  'patchApiV1ServicesServiceIdTermsTermIdPriceGroups'(
    parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdTermsTermIdPriceGroups.PathParameters> | null,
    data?: Paths.PatchApiV1ServicesServiceIdTermsTermIdPriceGroups.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1ServicesServiceIdTermsTermIdPriceGroups.Responses.$200>
  /**
   * getApiV1Companies - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_BROWSING]
   */
  'getApiV1Companies'(
    parameters?: Parameters<Paths.GetApiV1Companies.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Companies.Responses.$200>
  /**
   * postApiV1Companies - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
   */
  'postApiV1Companies'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Companies.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Companies.Responses.$200>
  /**
   * getApiV1CompaniesCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT, COMPANIES_BROWSING]
   */
  'getApiV1CompaniesCompanyId'(
    parameters?: Parameters<Paths.GetApiV1CompaniesCompanyId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1CompaniesCompanyId.Responses.$200>
  /**
   * patchApiV1CompaniesCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
   */
  'patchApiV1CompaniesCompanyId'(
    parameters?: Parameters<Paths.PatchApiV1CompaniesCompanyId.PathParameters> | null,
    data?: Paths.PatchApiV1CompaniesCompanyId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1CompaniesCompanyId.Responses.$200>
  /**
   * deleteApiV1CompaniesCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
   */
  'deleteApiV1CompaniesCompanyId'(
    parameters?: Parameters<Paths.DeleteApiV1CompaniesCompanyId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1CompaniesCompanyId.Responses.$200>
  /**
   * getApiV1CompaniesCompanyIdCompanyBranches - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT, COMPANIES_BROWSING]
   */
  'getApiV1CompaniesCompanyIdCompanyBranches'(
    parameters?: Parameters<Paths.GetApiV1CompaniesCompanyIdCompanyBranches.PathParameters & Paths.GetApiV1CompaniesCompanyIdCompanyBranches.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1CompaniesCompanyIdCompanyBranches.Responses.$200>
  /**
   * getApiV1CompanyBranches - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT, BUSINESS_CASES_BROWSING]
   */
  'getApiV1CompanyBranches'(
    parameters?: Parameters<Paths.GetApiV1CompanyBranches.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1CompanyBranches.Responses.$200>
  /**
   * postApiV1CompanyBranches - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
   */
  'postApiV1CompanyBranches'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1CompanyBranches.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1CompanyBranches.Responses.$200>
  /**
   * getApiV1CompanyBranchesCompanyBranchId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_BROWSING]
   */
  'getApiV1CompanyBranchesCompanyBranchId'(
    parameters?: Parameters<Paths.GetApiV1CompanyBranchesCompanyBranchId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1CompanyBranchesCompanyBranchId.Responses.$200>
  /**
   * patchApiV1CompanyBranchesCompanyBranchId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
   */
  'patchApiV1CompanyBranchesCompanyBranchId'(
    parameters?: Parameters<Paths.PatchApiV1CompanyBranchesCompanyBranchId.PathParameters> | null,
    data?: Paths.PatchApiV1CompanyBranchesCompanyBranchId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1CompanyBranchesCompanyBranchId.Responses.$200>
  /**
   * deleteApiV1CompanyBranchesCompanyBranchId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
   */
  'deleteApiV1CompanyBranchesCompanyBranchId'(
    parameters?: Parameters<Paths.DeleteApiV1CompanyBranchesCompanyBranchId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1CompanyBranchesCompanyBranchId.Responses.$200>
  /**
   * getApiV1CompanyBranchesCompanyBranchIdOrganizations - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_BROWSING]
   */
  'getApiV1CompanyBranchesCompanyBranchIdOrganizations'(
    parameters?: Parameters<Paths.GetApiV1CompanyBranchesCompanyBranchIdOrganizations.PathParameters & Paths.GetApiV1CompanyBranchesCompanyBranchIdOrganizations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1CompanyBranchesCompanyBranchIdOrganizations.Responses.$200>
  /**
   * getApiV1Organizations - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_BROWSING]
   */
  'getApiV1Organizations'(
    parameters?: Parameters<Paths.GetApiV1Organizations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Organizations.Responses.$200>
  /**
   * postApiV1Organizations - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
   */
  'postApiV1Organizations'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Organizations.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Organizations.Responses.$200>
  /**
   * getApiV1OrganizationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_BROWSING]
   */
  'getApiV1OrganizationsId'(
    parameters?: Parameters<Paths.GetApiV1OrganizationsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1OrganizationsId.Responses.$200>
  /**
   * patchApiV1OrganizationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
   */
  'patchApiV1OrganizationsId'(
    parameters?: Parameters<Paths.PatchApiV1OrganizationsId.PathParameters> | null,
    data?: Paths.PatchApiV1OrganizationsId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1OrganizationsId.Responses.$200>
  /**
   * deleteApiV1OrganizationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
   */
  'deleteApiV1OrganizationsId'(
    parameters?: Parameters<Paths.DeleteApiV1OrganizationsId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1OrganizationsId.Responses.$200>
  /**
   * getApiV1OrganizationsIdOrganizationBranches - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_BROWSING]
   */
  'getApiV1OrganizationsIdOrganizationBranches'(
    parameters?: Parameters<Paths.GetApiV1OrganizationsIdOrganizationBranches.PathParameters & Paths.GetApiV1OrganizationsIdOrganizationBranches.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1OrganizationsIdOrganizationBranches.Responses.$200>
  /**
   * getApiV1OrganizationBranchesId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_BROWSING]
   */
  'getApiV1OrganizationBranchesId'(
    parameters?: Parameters<Paths.GetApiV1OrganizationBranchesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1OrganizationBranchesId.Responses.$200>
  /**
   * patchApiV1OrganizationBranchesId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
   */
  'patchApiV1OrganizationBranchesId'(
    parameters?: Parameters<Paths.PatchApiV1OrganizationBranchesId.PathParameters> | null,
    data?: Paths.PatchApiV1OrganizationBranchesId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1OrganizationBranchesId.Responses.$200>
  /**
   * deleteApiV1OrganizationBranchesId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
   */
  'deleteApiV1OrganizationBranchesId'(
    parameters?: Parameters<Paths.DeleteApiV1OrganizationBranchesId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1OrganizationBranchesId.Responses.$200>
  /**
   * postApiV1OrganizationBranches - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
   */
  'postApiV1OrganizationBranches'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1OrganizationBranches.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1OrganizationBranches.Responses.$200>
  /**
   * getApiV1BusinessCasesBusinessCaseIdTravelers - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT, BUSINESS_CASES_BROWSING]
   */
  'getApiV1BusinessCasesBusinessCaseIdTravelers'(
    parameters?: Parameters<Paths.GetApiV1BusinessCasesBusinessCaseIdTravelers.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1BusinessCasesBusinessCaseIdTravelers.Responses.$200>
  /**
   * patchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
   */
  'patchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId'(
    parameters?: Parameters<Paths.PatchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId.PathParameters> | null,
    data?: Paths.PatchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId.Responses.$200>
  /**
   * getApiV1BusinessCasesBusinessCaseIdNotes - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
   */
  'getApiV1BusinessCasesBusinessCaseIdNotes'(
    parameters?: Parameters<Paths.GetApiV1BusinessCasesBusinessCaseIdNotes.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1BusinessCasesBusinessCaseIdNotes.Responses.$200>
  /**
   * postApiV1BusinessCasesBusinessCaseIdNotes - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
   */
  'postApiV1BusinessCasesBusinessCaseIdNotes'(
    parameters?: Parameters<Paths.PostApiV1BusinessCasesBusinessCaseIdNotes.PathParameters> | null,
    data?: Paths.PostApiV1BusinessCasesBusinessCaseIdNotes.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1BusinessCasesBusinessCaseIdNotes.Responses.$200>
  /**
   * deleteApiV1BusinessCasesBusinessCaseIdNotesBusinessCaseNoteId - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
   */
  'deleteApiV1BusinessCasesBusinessCaseIdNotesBusinessCaseNoteId'(
    parameters?: Parameters<Paths.DeleteApiV1BusinessCasesBusinessCaseIdNotesBusinessCaseNoteId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1BusinessCasesBusinessCaseIdNotesBusinessCaseNoteId.Responses.$200>
  /**
   * getApiV1BusinessCases - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_BROWSING]
   */
  'getApiV1BusinessCases'(
    parameters?: Parameters<Paths.GetApiV1BusinessCases.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1BusinessCases.Responses.$200>
  /**
   * getApiV1BusinessCasesBusinessCaseId - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_BROWSING, BUSINESS_CASES_EDIT]
   */
  'getApiV1BusinessCasesBusinessCaseId'(
    parameters?: Parameters<Paths.GetApiV1BusinessCasesBusinessCaseId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1BusinessCasesBusinessCaseId.Responses.$200>
  /**
   * getApiV1Customers - PERMISSION: [SUPER_ADMIN, ADMIN, CUSTOMERS_BROWSING, BUSINESS_CASES_BROWSING, SALES]
   */
  'getApiV1Customers'(
    parameters?: Parameters<Paths.GetApiV1Customers.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Customers.Responses.$200>
  /**
   * getApiV1CustomersCustomerId - PERMISSION: [SUPER_ADMIN, ADMIN, CUSTOMERS_BROWSING, BUSINESS_CASES_BROWSING, SALES]
   */
  'getApiV1CustomersCustomerId'(
    parameters?: Parameters<Paths.GetApiV1CustomersCustomerId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1CustomersCustomerId.Responses.$200>
  /**
   * getApiV1People - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT, BUSINESS_CASES_BROWSING, SALES]
   */
  'getApiV1People'(
    parameters?: Parameters<Paths.GetApiV1People.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1People.Responses.$200>
  /**
   * getApiV1PeoplePersonId - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT, SALES]
   */
  'getApiV1PeoplePersonId'(
    parameters?: Parameters<Paths.GetApiV1PeoplePersonId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1PeoplePersonId.Responses.$200>
  /**
   * getApiV1Products - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'getApiV1Products'(
    parameters?: Parameters<Paths.GetApiV1Products.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV1ProductsDestinations - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'getApiV1ProductsDestinations'(
    parameters?: Parameters<Paths.GetApiV1ProductsDestinations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ProductsDestinations.Responses.$200>
  /**
   * getApiV1ProductsStations - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'getApiV1ProductsStations'(
    parameters?: Parameters<Paths.GetApiV1ProductsStations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ProductsStations.Responses.$200>
  /**
   * getApiV1ProductsAvailableStations - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'getApiV1ProductsAvailableStations'(
    parameters?: Parameters<Paths.GetApiV1ProductsAvailableStations.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV1ProductsPersonType - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'getApiV1ProductsPersonType'(
    parameters?: Parameters<Paths.GetApiV1ProductsPersonType.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1ProductsPersonType.Responses.$200>
  /**
   * postApiV1ProductsAdditionalServices - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING, SALES]
   */
  'postApiV1ProductsAdditionalServices'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1ProductsAdditionalServices.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * postApiV1ProductsPrice - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'postApiV1ProductsPrice'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1ProductsPrice.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * postApiV1ProductsPriceTravelers - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'postApiV1ProductsPriceTravelers'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1ProductsPriceTravelers.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * postApiV1ProductsReservation - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'postApiV1ProductsReservation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1ProductsReservation.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1ProductsReservation.Responses.$200>
  /**
   * postApiV1ProductsCheckAvailability - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'postApiV1ProductsCheckAvailability'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1ProductsCheckAvailability.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * getApiV1Discounts - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_BROWSING]
   */
  'getApiV1Discounts'(
    parameters?: Parameters<Paths.GetApiV1Discounts.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Discounts.Responses.$200>
  /**
   * postApiV1Discounts - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT]
   */
  'postApiV1Discounts'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Discounts.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Discounts.Responses.$200>
  /**
   * getApiV1DiscountsServiceUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_BROWSING]
   */
  'getApiV1DiscountsServiceUnitTemplates'(
    parameters?: Parameters<Paths.GetApiV1DiscountsServiceUnitTemplates.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DiscountsServiceUnitTemplates.Responses.$200>
  /**
   * getApiV1DiscountsDiscountId - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT, DISCOUNT_BROWSING]
   */
  'getApiV1DiscountsDiscountId'(
    parameters?: Parameters<Paths.GetApiV1DiscountsDiscountId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DiscountsDiscountId.Responses.$200>
  /**
   * patchApiV1DiscountsDiscountId - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT]
   */
  'patchApiV1DiscountsDiscountId'(
    parameters?: Parameters<Paths.PatchApiV1DiscountsDiscountId.PathParameters> | null,
    data?: Paths.PatchApiV1DiscountsDiscountId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1DiscountsDiscountId.Responses.$200>
  /**
   * deleteApiV1DiscountsDiscountId - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT]
   */
  'deleteApiV1DiscountsDiscountId'(
    parameters?: Parameters<Paths.DeleteApiV1DiscountsDiscountId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1DiscountsDiscountId.Responses.$200>
  /**
   * getApiV1Insurances - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_BROWSING]
   */
  'getApiV1Insurances'(
    parameters?: Parameters<Paths.GetApiV1Insurances.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Insurances.Responses.$200>
  /**
   * postApiV1Insurances - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_EDIT]
   */
  'postApiV1Insurances'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Insurances.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Insurances.Responses.$200>
  /**
   * getApiV1InsurancesInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_EDIT, INSURANCE_BROWSING]
   */
  'getApiV1InsurancesInsuranceId'(
    parameters?: Parameters<Paths.GetApiV1InsurancesInsuranceId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1InsurancesInsuranceId.Responses.$200>
  /**
   * patchApiV1InsurancesInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_EDIT]
   */
  'patchApiV1InsurancesInsuranceId'(
    parameters?: Parameters<Paths.PatchApiV1InsurancesInsuranceId.PathParameters> | null,
    data?: Paths.PatchApiV1InsurancesInsuranceId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1InsurancesInsuranceId.Responses.$200>
  /**
   * deleteApiV1InsurancesInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_EDIT]
   */
  'deleteApiV1InsurancesInsuranceId'(
    parameters?: Parameters<Paths.DeleteApiV1InsurancesInsuranceId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1InsurancesInsuranceId.Responses.$200>
  /**
   * getApiV1DocumentsReservationsReservationId - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'getApiV1DocumentsReservationsReservationId'(
    parameters?: Parameters<Paths.GetApiV1DocumentsReservationsReservationId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DocumentsReservationsReservationId.Responses.$200>
  /**
   * getApiV1DocumentsReservationsReservationIdExport - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'getApiV1DocumentsReservationsReservationIdExport'(
    parameters?: Parameters<Paths.GetApiV1DocumentsReservationsReservationIdExport.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1DocumentsReservationsReservationIdExport.Responses.$200>
  /**
   * postApiV1DocumentsReservationsReservationIdSend - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'postApiV1DocumentsReservationsReservationIdSend'(
    parameters?: Parameters<Paths.PostApiV1DocumentsReservationsReservationIdSend.PathParameters> | null,
    data?: Paths.PostApiV1DocumentsReservationsReservationIdSend.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1DocumentsReservationsReservationIdSend.Responses.$200>
  /**
   * postApiV1DocumentsReservationCalculationsExport - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'postApiV1DocumentsReservationCalculationsExport'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1DocumentsReservationCalculationsExport.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1DocumentsReservationCalculationsExport.Responses.$200>
  /**
   * postApiV1DocumentsReservationCalculationsSend - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
   */
  'postApiV1DocumentsReservationCalculationsSend'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1DocumentsReservationCalculationsSend.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1DocumentsReservationCalculationsSend.Responses.$200>
  /**
   * getApiV1Payments - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT, PAYMENTS_BROWSING]
   */
  'getApiV1Payments'(
    parameters?: Parameters<Paths.GetApiV1Payments.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Payments.Responses.$200>
  /**
   * postApiV1Payments - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT]
   */
  'postApiV1Payments'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Payments.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Payments.Responses.$200>
  /**
   * getApiV1PaymentsPaymentId - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT, PAYMENTS_BROWSING]
   */
  'getApiV1PaymentsPaymentId'(
    parameters?: Parameters<Paths.GetApiV1PaymentsPaymentId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1PaymentsPaymentId.Responses.$200>
  /**
   * patchApiV1PaymentsPaymentId - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT]
   */
  'patchApiV1PaymentsPaymentId'(
    parameters?: Parameters<Paths.PatchApiV1PaymentsPaymentId.PathParameters> | null,
    data?: Paths.PatchApiV1PaymentsPaymentId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1PaymentsPaymentId.Responses.$200>
  /**
   * deleteApiV1PaymentsPaymentId - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT]
   */
  'deleteApiV1PaymentsPaymentId'(
    parameters?: Parameters<Paths.DeleteApiV1PaymentsPaymentId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1PaymentsPaymentId.Responses.$200>
  /**
   * getApiV1PaymentsPaymentIdLogs - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT, PAYMENTS_BROWSING]
   */
  'getApiV1PaymentsPaymentIdLogs'(
    parameters?: Parameters<Paths.GetApiV1PaymentsPaymentIdLogs.PathParameters & Paths.GetApiV1PaymentsPaymentIdLogs.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1PaymentsPaymentIdLogs.Responses.$200>
  /**
   * getApiV1Commisions - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_BROWSING]
   */
  'getApiV1Commisions'(
    parameters?: Parameters<Paths.GetApiV1Commisions.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1Commisions.Responses.$200>
  /**
   * postApiV1Commisions - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_EDIT]
   */
  'postApiV1Commisions'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiV1Commisions.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiV1Commisions.Responses.$200>
  /**
   * getApiV1CommisionsCommisionId - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_BROWSING]
   */
  'getApiV1CommisionsCommisionId'(
    parameters?: Parameters<Paths.GetApiV1CommisionsCommisionId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiV1CommisionsCommisionId.Responses.$200>
  /**
   * patchApiV1CommisionsCommisionId - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_EDIT]
   */
  'patchApiV1CommisionsCommisionId'(
    parameters?: Parameters<Paths.PatchApiV1CommisionsCommisionId.PathParameters> | null,
    data?: Paths.PatchApiV1CommisionsCommisionId.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiV1CommisionsCommisionId.Responses.$200>
  /**
   * deleteApiV1CommisionsCommisionId - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_EDIT]
   */
  'deleteApiV1CommisionsCommisionId'(
    parameters?: Parameters<Paths.DeleteApiV1CommisionsCommisionId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteApiV1CommisionsCommisionId.Responses.$200>
}

export interface PathsDictionary {
  ['/api/v1/authorization/ping']: {
    /**
     * postApiV1AuthorizationPing - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1AuthorizationPing.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1AuthorizationPing.Responses.$200>
  }
  ['/api/v1/authorization/forgot-password']: {
    /**
     * postApiV1AuthorizationForgotPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1AuthorizationForgotPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1AuthorizationForgotPassword.Responses.$200>
  }
  ['/api/v1/authorization/reset-password']: {
    /**
     * postApiV1AuthorizationResetPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1AuthorizationResetPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/permissions/']: {
    /**
     * getApiV1Permissions - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Permissions.Responses.$200>
  }
  ['/api/v1/enumerations/web-projects/']: {
    /**
     * getApiV1EnumerationsWebProjects - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsWebProjects.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsWebProjects.Responses.$200>
  }
  ['/api/v1/enumerations/web-projects/{code}']: {
    /**
     * getApiV1EnumerationsWebProjectsCode - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsWebProjectsCode.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsWebProjectsCode.Responses.$200>
    /**
     * patchApiV1EnumerationsWebProjectsCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsWebProjectsCode.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsWebProjectsCode.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsWebProjectsCode.Responses.$200>
  }
  ['/api/v1/enumerations/languages/']: {
    /**
     * getApiV1EnumerationsLanguages - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsLanguages.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsLanguages.Responses.$200>
    /**
     * postApiV1EnumerationsLanguages - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsLanguages.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsLanguages.Responses.$200>
  }
  ['/api/v1/enumerations/languages/{code}']: {
    /**
     * getApiV1EnumerationsLanguagesCode - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsLanguagesCode.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsLanguagesCode.Responses.$200>
    /**
     * patchApiV1EnumerationsLanguagesCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsLanguagesCode.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsLanguagesCode.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsLanguagesCode.Responses.$200>
    /**
     * deleteApiV1EnumerationsLanguagesCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsLanguagesCode.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsLanguagesCode.Responses.$200>
  }
  ['/api/v1/enumerations/facility-types/']: {
    /**
     * getApiV1EnumerationsFacilityTypes - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsFacilityTypes.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsFacilityTypes.Responses.$200>
    /**
     * postApiV1EnumerationsFacilityTypes - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsFacilityTypes.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsFacilityTypes.Responses.$200>
  }
  ['/api/v1/enumerations/facility-types/{id}']: {
    /**
     * getApiV1EnumerationsFacilityTypesId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsFacilityTypesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsFacilityTypesId.Responses.$200>
    /**
     * patchApiV1EnumerationsFacilityTypesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsFacilityTypesId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsFacilityTypesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsFacilityTypesId.Responses.$200>
    /**
     * deleteApiV1EnumerationsFacilityTypesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsFacilityTypesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsFacilityTypesId.Responses.$200>
  }
  ['/api/v1/enumerations/vat-rates/']: {
    /**
     * getApiV1EnumerationsVatRates - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsVatRates.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsVatRates.Responses.$200>
    /**
     * postApiV1EnumerationsVatRates - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsVatRates.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsVatRates.Responses.$200>
  }
  ['/api/v1/enumerations/vat-rates/{id}']: {
    /**
     * getApiV1EnumerationsVatRatesId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsVatRatesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsVatRatesId.Responses.$200>
    /**
     * patchApiV1EnumerationsVatRatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsVatRatesId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsVatRatesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsVatRatesId.Responses.$200>
    /**
     * deleteApiV1EnumerationsVatRatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsVatRatesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsVatRatesId.Responses.$200>
  }
  ['/api/v1/enumerations/currencies/']: {
    /**
     * getApiV1EnumerationsCurrencies - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsCurrencies.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsCurrencies.Responses.$200>
    /**
     * postApiV1EnumerationsCurrencies - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsCurrencies.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsCurrencies.Responses.$200>
  }
  ['/api/v1/enumerations/currencies/{code}']: {
    /**
     * getApiV1EnumerationsCurrenciesCode - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsCurrenciesCode.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsCurrenciesCode.Responses.$200>
    /**
     * patchApiV1EnumerationsCurrenciesCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsCurrenciesCode.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsCurrenciesCode.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsCurrenciesCode.Responses.$200>
    /**
     * deleteApiV1EnumerationsCurrenciesCode - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsCurrenciesCode.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsCurrenciesCode.Responses.$200>
  }
  ['/api/v1/enumerations/countries/']: {
    /**
     * getApiV1EnumerationsCountries - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsCountries.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsCountries.Responses.$200>
    /**
     * postApiV1EnumerationsCountries - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsCountries.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsCountries.Responses.$200>
  }
  ['/api/v1/enumerations/countries/{id}']: {
    /**
     * getApiV1EnumerationsCountriesId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsCountriesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsCountriesId.Responses.$200>
    /**
     * patchApiV1EnumerationsCountriesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsCountriesId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsCountriesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsCountriesId.Responses.$200>
    /**
     * deleteApiV1EnumerationsCountriesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsCountriesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsCountriesId.Responses.$200>
  }
  ['/api/v1/enumerations/unit-templates/']: {
    /**
     * getApiV1EnumerationsUnitTemplates - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsUnitTemplates.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsUnitTemplates.Responses.$200>
    /**
     * postApiV1EnumerationsUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsUnitTemplates.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsUnitTemplates.Responses.$200>
  }
  ['/api/v1/enumerations/unit-templates/{id}']: {
    /**
     * getApiV1EnumerationsUnitTemplatesId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsUnitTemplatesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsUnitTemplatesId.Responses.$200>
    /**
     * patchApiV1EnumerationsUnitTemplatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsUnitTemplatesId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsUnitTemplatesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsUnitTemplatesId.Responses.$200>
    /**
     * deleteApiV1EnumerationsUnitTemplatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsUnitTemplatesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsUnitTemplatesId.Responses.$200>
  }
  ['/api/v1/enumerations/text-templates/']: {
    /**
     * getApiV1EnumerationsTextTemplates - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsTextTemplates.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsTextTemplates.Responses.$200>
    /**
     * postApiV1EnumerationsTextTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsTextTemplates.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsTextTemplates.Responses.$200>
  }
  ['/api/v1/enumerations/text-templates/{textTemplateID}']: {
    /**
     * getApiV1EnumerationsTextTemplatesTextTemplateId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateId.Responses.$200>
    /**
     * patchApiV1EnumerationsTextTemplatesTextTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateId.Responses.$200>
    /**
     * deleteApiV1EnumerationsTextTemplatesTextTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsTextTemplatesTextTemplateId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsTextTemplatesTextTemplateId.Responses.$200>
  }
  ['/api/v1/enumerations/text-templates/{textTemplateID}/text-items/']: {
    /**
     * getApiV1EnumerationsTextTemplatesTextTemplateIdTextItems - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.PathParameters & Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.Responses.$200>
    /**
     * postApiV1EnumerationsTextTemplatesTextTemplateIdTextItems - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.PathParameters> | null,
      data?: Paths.PostApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsTextTemplatesTextTemplateIdTextItems.Responses.$200>
  }
  ['/api/v1/enumerations/text-templates/{textTemplateID}/text-items/{textItemID}']: {
    /**
     * getApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.Responses.$200>
    /**
     * patchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.Responses.$200>
    /**
     * deleteApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsTextTemplatesTextTemplateIdTextItemsTextItemId.Responses.$200>
  }
  ['/api/v1/enumerations/stations/{id}']: {
    /**
     * getApiV1EnumerationsStationsId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsStationsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsStationsId.Responses.$200>
    /**
     * patchApiV1EnumerationsStationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsStationsId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsStationsId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsStationsId.Responses.$200>
    /**
     * deleteApiV1EnumerationsStationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsStationsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsStationsId.Responses.$200>
  }
  ['/api/v1/enumerations/stations/']: {
    /**
     * getApiV1EnumerationsStations - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsStations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsStations.Responses.$200>
    /**
     * postApiV1EnumerationsStations - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsStations.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsStations.Responses.$200>
  }
  ['/api/v1/enumerations/properties/{id}']: {
    /**
     * getApiV1EnumerationsPropertiesId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsPropertiesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsPropertiesId.Responses.$200>
    /**
     * patchApiV1EnumerationsPropertiesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsPropertiesId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsPropertiesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsPropertiesId.Responses.$200>
    /**
     * deleteApiV1EnumerationsPropertiesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsPropertiesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsPropertiesId.Responses.$200>
  }
  ['/api/v1/enumerations/properties/']: {
    /**
     * getApiV1EnumerationsProperties - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsProperties.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsProperties.Responses.$200>
    /**
     * postApiV1EnumerationsProperties - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsProperties.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsProperties.Responses.$200>
  }
  ['/api/v1/enumerations/seasons/']: {
    /**
     * getApiV1EnumerationsSeasons - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsSeasons.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsSeasons.Responses.$200>
    /**
     * postApiV1EnumerationsSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsSeasons.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsSeasons.Responses.$200>
  }
  ['/api/v1/enumerations/seasons/{id}']: {
    /**
     * getApiV1EnumerationsSeasonsId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsSeasonsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsSeasonsId.Responses.$200>
    /**
     * patchApiV1EnumerationsSeasonsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsSeasonsId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsSeasonsId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsSeasonsId.Responses.$200>
    /**
     * deleteApiV1EnumerationsSeasonsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsSeasonsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsSeasonsId.Responses.$200>
  }
  ['/api/v1/enumerations/product-types/']: {
    /**
     * getApiV1EnumerationsProductTypes - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsProductTypes.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsProductTypes.Responses.$200>
    /**
     * postApiV1EnumerationsProductTypes - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsProductTypes.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsProductTypes.Responses.$200>
  }
  ['/api/v1/enumerations/product-types/{productTypeID}']: {
    /**
     * getApiV1EnumerationsProductTypesProductTypeId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsProductTypesProductTypeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsProductTypesProductTypeId.Responses.$200>
    /**
     * patchApiV1EnumerationsProductTypesProductTypeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsProductTypesProductTypeId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsProductTypesProductTypeId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsProductTypesProductTypeId.Responses.$200>
    /**
     * deleteApiV1EnumerationsProductTypesProductTypeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsProductTypesProductTypeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsProductTypesProductTypeId.Responses.$200>
  }
  ['/api/v1/enumerations/person-types/']: {
    /**
     * getApiV1EnumerationsPersonTypes - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsPersonTypes.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsPersonTypes.Responses.$200>
    /**
     * postApiV1EnumerationsPersonTypes - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsPersonTypes.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsPersonTypes.Responses.$200>
  }
  ['/api/v1/enumerations/person-types/{personTypeID}']: {
    /**
     * getApiV1EnumerationsPersonTypesPersonTypeId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsPersonTypesPersonTypeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsPersonTypesPersonTypeId.Responses.$200>
    /**
     * patchApiV1EnumerationsPersonTypesPersonTypeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsPersonTypesPersonTypeId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsPersonTypesPersonTypeId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsPersonTypesPersonTypeId.Responses.$200>
    /**
     * deleteApiV1EnumerationsPersonTypesPersonTypeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsPersonTypesPersonTypeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsPersonTypesPersonTypeId.Responses.$200>
  }
  ['/api/v1/enumerations/product-catalogues/']: {
    /**
     * getApiV1EnumerationsProductCatalogues - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsProductCatalogues.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsProductCatalogues.Responses.$200>
    /**
     * postApiV1EnumerationsProductCatalogues - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsProductCatalogues.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsProductCatalogues.Responses.$200>
  }
  ['/api/v1/enumerations/product-catalogues/{productCatalogueID}']: {
    /**
     * getApiV1EnumerationsProductCataloguesProductCatalogueId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsProductCataloguesProductCatalogueId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsProductCataloguesProductCatalogueId.Responses.$200>
    /**
     * patchApiV1EnumerationsProductCataloguesProductCatalogueId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsProductCataloguesProductCatalogueId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsProductCataloguesProductCatalogueId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsProductCataloguesProductCatalogueId.Responses.$200>
    /**
     * deleteApiV1EnumerationsProductCataloguesProductCatalogueId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsProductCataloguesProductCatalogueId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsProductCataloguesProductCatalogueId.Responses.$200>
  }
  ['/api/v1/enumerations/meal-plans/']: {
    /**
     * getApiV1EnumerationsMealPlans - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsMealPlans.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsMealPlans.Responses.$200>
    /**
     * postApiV1EnumerationsMealPlans - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsMealPlans.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsMealPlans.Responses.$200>
  }
  ['/api/v1/enumerations/meal-plans/{id}']: {
    /**
     * getApiV1EnumerationsMealPlansId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsMealPlansId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsMealPlansId.Responses.$200>
    /**
     * patchApiV1EnumerationsMealPlansId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsMealPlansId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsMealPlansId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsMealPlansId.Responses.$200>
    /**
     * deleteApiV1EnumerationsMealPlansId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsMealPlansId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsMealPlansId.Responses.$200>
  }
  ['/api/v1/enumerations/pricelist-items/']: {
    /**
     * getApiV1EnumerationsPricelistItems - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsPricelistItems.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsPricelistItems.Responses.$200>
    /**
     * postApiV1EnumerationsPricelistItems - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsPricelistItems.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsPricelistItems.Responses.$200>
  }
  ['/api/v1/enumerations/pricelist-items/{id}']: {
    /**
     * getApiV1EnumerationsPricelistItemsId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsPricelistItemsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsPricelistItemsId.Responses.$200>
    /**
     * patchApiV1EnumerationsPricelistItemsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsPricelistItemsId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsPricelistItemsId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsPricelistItemsId.Responses.$200>
    /**
     * deleteApiV1EnumerationsPricelistItemsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsPricelistItemsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsPricelistItemsId.Responses.$200>
  }
  ['/api/v1/enumerations/price-groups/']: {
    /**
     * getApiV1EnumerationsPriceGroups - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsPriceGroups.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsPriceGroups.Responses.$200>
    /**
     * postApiV1EnumerationsPriceGroups - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsPriceGroups.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsPriceGroups.Responses.$200>
  }
  ['/api/v1/enumerations/price-groups/{id}']: {
    /**
     * getApiV1EnumerationsPriceGroupsId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsPriceGroupsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsPriceGroupsId.Responses.$200>
    /**
     * patchApiV1EnumerationsPriceGroupsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsPriceGroupsId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsPriceGroupsId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsPriceGroupsId.Responses.$200>
    /**
     * deleteApiV1EnumerationsPriceGroupsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsPriceGroupsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsPriceGroupsId.Responses.$200>
  }
  ['/api/v1/enumerations/exchange-rates/']: {
    /**
     * getApiV1EnumerationsExchangeRates - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsExchangeRates.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsExchangeRates.Responses.$200>
    /**
     * postApiV1EnumerationsExchangeRates - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsExchangeRates.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsExchangeRates.Responses.$200>
  }
  ['/api/v1/enumerations/exchange-rates/{id}']: {
    /**
     * getApiV1EnumerationsExchangeRatesId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsExchangeRatesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsExchangeRatesId.Responses.$200>
    /**
     * patchApiV1EnumerationsExchangeRatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsExchangeRatesId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsExchangeRatesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsExchangeRatesId.Responses.$200>
    /**
     * deleteApiV1EnumerationsExchangeRatesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsExchangeRatesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsExchangeRatesId.Responses.$200>
  }
  ['/api/v1/enumerations/carriers/']: {
    /**
     * getApiV1EnumerationsCarriers - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsCarriers.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsCarriers.Responses.$200>
    /**
     * postApiV1EnumerationsCarriers - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsCarriers.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsCarriers.Responses.$200>
  }
  ['/api/v1/enumerations/carriers/{carrierID}']: {
    /**
     * getApiV1EnumerationsCarriersCarrierId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsCarriersCarrierId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsCarriersCarrierId.Responses.$200>
    /**
     * patchApiV1EnumerationsCarriersCarrierId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsCarriersCarrierId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsCarriersCarrierId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsCarriersCarrierId.Responses.$200>
    /**
     * deleteApiV1EnumerationsCarriersCarrierId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsCarriersCarrierId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsCarriersCarrierId.Responses.$200>
  }
  ['/api/v1/enumerations/sales-channels/']: {
    /**
     * getApiV1EnumerationsSalesChannels - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsSalesChannels.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsSalesChannels.Responses.$200>
    /**
     * postApiV1EnumerationsSalesChannels - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsSalesChannels.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsSalesChannels.Responses.$200>
  }
  ['/api/v1/enumerations/sales-channels/{salesChannelID}']: {
    /**
     * getApiV1EnumerationsSalesChannelsSalesChannelId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsSalesChannelsSalesChannelId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsSalesChannelsSalesChannelId.Responses.$200>
    /**
     * patchApiV1EnumerationsSalesChannelsSalesChannelId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsSalesChannelsSalesChannelId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsSalesChannelsSalesChannelId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsSalesChannelsSalesChannelId.Responses.$200>
    /**
     * deleteApiV1EnumerationsSalesChannelsSalesChannelId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsSalesChannelsSalesChannelId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsSalesChannelsSalesChannelId.Responses.$200>
  }
  ['/api/v1/enumerations/discount-marks/']: {
    /**
     * getApiV1EnumerationsDiscountMarks - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsDiscountMarks.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsDiscountMarks.Responses.$200>
    /**
     * postApiV1EnumerationsDiscountMarks - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsDiscountMarks.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsDiscountMarks.Responses.$200>
  }
  ['/api/v1/enumerations/discount-marks/{discountMarkID}']: {
    /**
     * getApiV1EnumerationsDiscountMarksDiscountMarkId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsDiscountMarksDiscountMarkId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsDiscountMarksDiscountMarkId.Responses.$200>
    /**
     * patchApiV1EnumerationsDiscountMarksDiscountMarkId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsDiscountMarksDiscountMarkId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsDiscountMarksDiscountMarkId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsDiscountMarksDiscountMarkId.Responses.$200>
    /**
     * deleteApiV1EnumerationsDiscountMarksDiscountMarkId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsDiscountMarksDiscountMarkId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsDiscountMarksDiscountMarkId.Responses.$200>
  }
  ['/api/v1/enumerations/reservation-expiration-times/']: {
    /**
     * getApiV1EnumerationsReservationExpirationTimes - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsReservationExpirationTimes.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsReservationExpirationTimes.Responses.$200>
    /**
     * postApiV1EnumerationsReservationExpirationTimes - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsReservationExpirationTimes.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsReservationExpirationTimes.Responses.$200>
  }
  ['/api/v1/enumerations/reservation-expiration-times/{reservationExpirationTimeID}']: {
    /**
     * getApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.Responses.$200>
    /**
     * patchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.Responses.$200>
    /**
     * deleteApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsReservationExpirationTimesReservationExpirationTimeId.Responses.$200>
  }
  ['/api/v1/enumerations/insurance-companies/']: {
    /**
     * getApiV1EnumerationsInsuranceCompanies - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsInsuranceCompanies.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsInsuranceCompanies.Responses.$200>
    /**
     * postApiV1EnumerationsInsuranceCompanies - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsInsuranceCompanies.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsInsuranceCompanies.Responses.$200>
  }
  ['/api/v1/enumerations/insurance-companies/{insuranceCompanyID}']: {
    /**
     * getApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.Responses.$200>
    /**
     * patchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.Responses.$200>
    /**
     * deleteApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsInsuranceCompaniesInsuranceCompanyId.Responses.$200>
  }
  ['/api/v1/enumerations/unit-template-properties/{id}']: {
    /**
     * getApiV1EnumerationsUnitTemplatePropertiesId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsUnitTemplatePropertiesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsUnitTemplatePropertiesId.Responses.$200>
    /**
     * patchApiV1EnumerationsUnitTemplatePropertiesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsUnitTemplatePropertiesId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsUnitTemplatePropertiesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsUnitTemplatePropertiesId.Responses.$200>
    /**
     * deleteApiV1EnumerationsUnitTemplatePropertiesId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsUnitTemplatePropertiesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsUnitTemplatePropertiesId.Responses.$200>
  }
  ['/api/v1/enumerations/unit-template-properties/']: {
    /**
     * getApiV1EnumerationsUnitTemplateProperties - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsUnitTemplateProperties.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsUnitTemplateProperties.Responses.$200>
    /**
     * postApiV1EnumerationsUnitTemplateProperties - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsUnitTemplateProperties.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsUnitTemplateProperties.Responses.$200>
  }
  ['/api/v1/users/settings']: {
    /**
     * getApiV1UsersSettings - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1UsersSettings.Responses.$200>
    /**
     * patchApiV1UsersSettings - PERMISSION: NO
     */
    'patch'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PatchApiV1UsersSettings.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1UsersSettings.Responses.$200>
  }
  ['/api/v1/users/confirm']: {
    /**
     * postApiV1UsersConfirm - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1UsersConfirm.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1UsersConfirm.Responses.$200>
  }
  ['/api/v1/avatar/']: {
    /**
     * getApiV1Avatar - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Avatar.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/folders/']: {
    /**
     * getApiV1Folders - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Folders.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
    /**
     * postApiV1Folders - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Folders.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Folders.Responses.$200>
    /**
     * deleteApiV1Folders - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1Folders.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1Folders.Responses.$200>
  }
  ['/api/v1/folders/content']: {
    /**
     * getApiV1FoldersContent - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FoldersContent.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1FoldersContent.Responses.$200>
  }
  ['/api/v1/folders/content/filtered']: {
    /**
     * getApiV1FoldersContentFiltered - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FoldersContentFiltered.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1FoldersContentFiltered.Responses.$200>
  }
  ['/api/v1/files/{id}']: {
    /**
     * getApiV1FilesId - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FilesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1FilesId.Responses.$200>
    /**
     * patchApiV1FilesId - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1FilesId.PathParameters> | null,
      data?: Paths.PatchApiV1FilesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1FilesId.Responses.$200>
    /**
     * deleteApiV1FilesId - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1FilesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1FilesId.Responses.$200>
  }
  ['/api/v1/files/{id}/download']: {
    /**
     * getApiV1FilesIdDownload - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FilesIdDownload.PathParameters & Paths.GetApiV1FilesIdDownload.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/exports/']: {
    /**
     * getApiV1Exports - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Exports.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/file-tags/']: {
    /**
     * getApiV1FileTags - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FileTags.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1FileTags.Responses.$200>
  }
  ['/api/v1/file-tag-files/']: {
    /**
     * getApiV1FileTagFiles - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FileTagFiles.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1FileTagFiles.Responses.$200>
  }
  ['/api/v1/products/price/pgsync']: {
    /**
     * postApiV1ProductsPricePgsync - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1ProductsPricePgsync.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/authorization/login']: {
    /**
     * postApiV1AuthorizationLogin - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1AuthorizationLogin.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1AuthorizationLogin.Responses.$200>
  }
  ['/api/v1/static/pdfs/reservations/*']: {
    /**
     * getApiV1StaticPdfsReservations - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/static/*']: {
    /**
     * getApiV1Static - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION, COMPANIES_BROWSING]
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/authorization/login-as-user']: {
    /**
     * postApiV1AuthorizationLoginAsUser - PERMISSION: [SUPER_ADMIN]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1AuthorizationLoginAsUser.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1AuthorizationLoginAsUser.Responses.$200>
  }
  ['/api/v1/roles/']: {
    /**
     * getApiV1Roles - PERMISSION: [SUPER_ADMIN, ADMIN, USER_LIST]
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Roles.Responses.$200>
    /**
     * postApiV1Roles - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Roles.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Roles.Responses.$200>
  }
  ['/api/v1/roles/{roleID}']: {
    /**
     * getApiV1RolesRoleId - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1RolesRoleId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1RolesRoleId.Responses.$200>
    /**
     * patchApiV1RolesRoleId - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1RolesRoleId.PathParameters> | null,
      data?: Paths.PatchApiV1RolesRoleId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1RolesRoleId.Responses.$200>
    /**
     * deleteApiV1RolesRoleId - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1RolesRoleId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1RolesRoleId.Responses.$200>
  }
  ['/api/v1/roles/{roleID}/available-users']: {
    /**
     * getApiV1RolesRoleIdAvailableUsers - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1RolesRoleIdAvailableUsers.PathParameters & Paths.GetApiV1RolesRoleIdAvailableUsers.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1RolesRoleIdAvailableUsers.Responses.$200>
  }
  ['/api/v1/roles/{roleID}/assign-users/{userID}']: {
    /**
     * postApiV1RolesRoleIdAssignUsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1RolesRoleIdAssignUsersUserId.PathParameters> | null,
      data?: Paths.PostApiV1RolesRoleIdAssignUsersUserId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1RolesRoleIdAssignUsersUserId.Responses.$200>
  }
  ['/api/v1/roles/{roleID}/set-permissions']: {
    /**
     * patchApiV1RolesRoleIdSetPermissions - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1RolesRoleIdSetPermissions.PathParameters> | null,
      data?: Paths.PatchApiV1RolesRoleIdSetPermissions.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1RolesRoleIdSetPermissions.Responses.$200>
  }
  ['/api/v1/roles/{roleID}/unassign-users/{userID}']: {
    /**
     * deleteApiV1RolesRoleIdUnassignUsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1RolesRoleIdUnassignUsersUserId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1RolesRoleIdUnassignUsersUserId.Responses.$200>
  }
  ['/api/v1/enumerations/properties/{id}/reorder']: {
    /**
     * patchApiV1EnumerationsPropertiesIdReorder - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsPropertiesIdReorder.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsPropertiesIdReorder.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsPropertiesIdReorder.Responses.$200>
  }
  ['/api/v1/enumerations/person-types/{personTypeID}/reorder']: {
    /**
     * patchApiV1EnumerationsPersonTypesPersonTypeIdReorder - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsPersonTypesPersonTypeIdReorder.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsPersonTypesPersonTypeIdReorder.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsPersonTypesPersonTypeIdReorder.Responses.$200>
  }
  ['/api/v1/enumerations/deposit-amounts/']: {
    /**
     * getApiV1EnumerationsDepositAmounts - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsDepositAmounts.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsDepositAmounts.Responses.$200>
    /**
     * postApiV1EnumerationsDepositAmounts - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1EnumerationsDepositAmounts.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1EnumerationsDepositAmounts.Responses.$200>
  }
  ['/api/v1/enumerations/deposit-amounts/{id}']: {
    /**
     * getApiV1EnumerationsDepositAmountsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1EnumerationsDepositAmountsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1EnumerationsDepositAmountsId.Responses.$200>
    /**
     * patchApiV1EnumerationsDepositAmountsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1EnumerationsDepositAmountsId.PathParameters> | null,
      data?: Paths.PatchApiV1EnumerationsDepositAmountsId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1EnumerationsDepositAmountsId.Responses.$200>
    /**
     * deleteApiV1EnumerationsDepositAmountsId - PERMISSION: [SUPER_ADMIN, ADMIN, ENUMS_DEFINITION]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1EnumerationsDepositAmountsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1EnumerationsDepositAmountsId.Responses.$200>
  }
  ['/api/v1/users/']: {
    /**
     * getApiV1Users - PERMISSION: [SUPER_ADMIN, ADMIN, USER_LIST, BUSINESS_CASES_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Users.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Users.Responses.$200>
    /**
     * postApiV1Users - PERMISSION: [SUPER_ADMIN, ADMIN, USER_CREATE]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Users.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Users.Responses.$200>
  }
  ['/api/v1/users/{userID}']: {
    /**
     * getApiV1UsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT, USER_LIST]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1UsersUserId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1UsersUserId.Responses.$200>
    /**
     * patchApiV1UsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1UsersUserId.PathParameters> | null,
      data?: Paths.PatchApiV1UsersUserId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1UsersUserId.Responses.$200>
    /**
     * deleteApiV1UsersUserId - PERMISSION: [SUPER_ADMIN, ADMIN, USER_DELETE]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1UsersUserId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1UsersUserId.Responses.$200>
  }
  ['/api/v1/users/{userID}/assign-roles']: {
    /**
     * postApiV1UsersUserIdAssignRoles - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1UsersUserIdAssignRoles.PathParameters> | null,
      data?: Paths.PostApiV1UsersUserIdAssignRoles.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1UsersUserIdAssignRoles.Responses.$200>
  }
  ['/api/v1/users/{userID}/set-permissions']: {
    /**
     * patchApiV1UsersUserIdSetPermissions - PERMISSION: [SUPER_ADMIN, ADMIN]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1UsersUserIdSetPermissions.PathParameters> | null,
      data?: Paths.PatchApiV1UsersUserIdSetPermissions.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1UsersUserIdSetPermissions.Responses.$200>
  }
  ['/api/v1/users/{userID}/resend-registration-email']: {
    /**
     * patchApiV1UsersUserIdResendRegistrationEmail - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1UsersUserIdResendRegistrationEmail.PathParameters> | null,
      data?: Paths.PatchApiV1UsersUserIdResendRegistrationEmail.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1UsersUserIdResendRegistrationEmail.Responses.$200>
  }
  ['/api/v1/users/{userID}/send-reset-password-email']: {
    /**
     * patchApiV1UsersUserIdSendResetPasswordEmail - PERMISSION: [SUPER_ADMIN, ADMIN, USER_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1UsersUserIdSendResetPasswordEmail.PathParameters> | null,
      data?: Paths.PatchApiV1UsersUserIdSendResetPasswordEmail.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1UsersUserIdSendResetPasswordEmail.Responses.$200>
  }
  ['/api/v1/destinations/']: {
    /**
     * getApiV1Destinations - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_BROWSING, FACILITY_BROWSING, TRANSPORTATION_BROWSING, PRODUCT_BROWSING, DISCOUNT_BROWSING, ENUMS_DEFINITION]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Destinations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Destinations.Responses.$200>
    /**
     * postApiV1Destinations - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Destinations.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Destinations.Responses.$200>
  }
  ['/api/v1/destinations/nested']: {
  }
  ['/api/v1/destinations/{destinationID}']: {
    /**
     * getApiV1DestinationsDestinationId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT, ENUMS_DEFINITION, DESTINATION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationsDestinationId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationsDestinationId.Responses.$200>
    /**
     * patchApiV1DestinationsDestinationId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1DestinationsDestinationId.PathParameters> | null,
      data?: Paths.PatchApiV1DestinationsDestinationId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1DestinationsDestinationId.Responses.$200>
    /**
     * deleteApiV1DestinationsDestinationId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1DestinationsDestinationId.PathParameters & Paths.DeleteApiV1DestinationsDestinationId.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1DestinationsDestinationId.Responses.$200>
  }
  ['/api/v1/destinations/{destinationID}/text-items/']: {
    /**
     * getApiV1DestinationsDestinationIdTextItems - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT, DESTINATION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationsDestinationIdTextItems.PathParameters & Paths.GetApiV1DestinationsDestinationIdTextItems.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationsDestinationIdTextItems.Responses.$200>
  }
  ['/api/v1/destinations/{destinationID}/text-items/{textItemID}']: {
    /**
     * patchApiV1DestinationsDestinationIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1DestinationsDestinationIdTextItemsTextItemId.PathParameters & Paths.PatchApiV1DestinationsDestinationIdTextItemsTextItemId.QueryParameters> | null,
      data?: Paths.PatchApiV1DestinationsDestinationIdTextItemsTextItemId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1DestinationsDestinationIdTextItemsTextItemId.Responses.$200>
  }
  ['/api/v1/destinations/{destinationID}/gallery/']: {
    /**
     * getApiV1DestinationsDestinationIdGallery - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationsDestinationIdGallery.PathParameters & Paths.GetApiV1DestinationsDestinationIdGallery.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationsDestinationIdGallery.Responses.$200>
  }
  ['/api/v1/destinations/{destinationID}/gallery/assign-images']: {
    /**
     * postApiV1DestinationsDestinationIdGalleryAssignImages - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1DestinationsDestinationIdGalleryAssignImages.PathParameters> | null,
      data?: Paths.PostApiV1DestinationsDestinationIdGalleryAssignImages.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1DestinationsDestinationIdGalleryAssignImages.Responses.$200>
  }
  ['/api/v1/destinations/{destinationID}/gallery/reorder-images/{fileID}']: {
    /**
     * patchApiV1DestinationsDestinationIdGalleryReorderImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1DestinationsDestinationIdGalleryReorderImagesFileId.PathParameters & Paths.PatchApiV1DestinationsDestinationIdGalleryReorderImagesFileId.QueryParameters> | null,
      data?: Paths.PatchApiV1DestinationsDestinationIdGalleryReorderImagesFileId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1DestinationsDestinationIdGalleryReorderImagesFileId.Responses.$200>
  }
  ['/api/v1/destinations/{destinationID}/gallery/unassign-images/{fileID}']: {
    /**
     * deleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, DESTINATION_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId.PathParameters & Paths.DeleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1DestinationsDestinationIdGalleryUnassignImagesFileId.Responses.$200>
  }
  ['/api/v1/facilities/']: {
    /**
     * getApiV1Facilities - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_BROWSING, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Facilities.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Facilities.Responses.$200>
    /**
     * postApiV1Facilities - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Facilities.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Facilities.Responses.$200>
  }
  ['/api/v1/facilities/{facilityID}']: {
    /**
     * getApiV1FacilitiesFacilityId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT, FACILITY_BROWSING, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FacilitiesFacilityId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1FacilitiesFacilityId.Responses.$200>
    /**
     * patchApiV1FacilitiesFacilityId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1FacilitiesFacilityId.PathParameters> | null,
      data?: Paths.PatchApiV1FacilitiesFacilityId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1FacilitiesFacilityId.Responses.$200>
    /**
     * deleteApiV1FacilitiesFacilityId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1FacilitiesFacilityId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1FacilitiesFacilityId.Responses.$200>
  }
  ['/api/v1/facilities/{facilityID}/unit-templates/']: {
    /**
     * getApiV1FacilitiesFacilityIdUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_BROWSING, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FacilitiesFacilityIdUnitTemplates.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1FacilitiesFacilityIdUnitTemplates.Responses.$200>
  }
  ['/api/v1/facilities/{facilityID}/unit-templates/{unitTemplateID}']: {
    /**
     * postApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.PathParameters> | null,
      data?: Paths.PostApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.Responses.$200>
    /**
     * patchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.PathParameters> | null,
      data?: Paths.PatchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.Responses.$200>
    /**
     * deleteApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1FacilitiesFacilityIdUnitTemplatesUnitTemplateId.Responses.$200>
  }
  ['/api/v1/facilities/{facilityID}/gallery/']: {
    /**
     * getApiV1FacilitiesFacilityIdGallery - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FacilitiesFacilityIdGallery.PathParameters & Paths.GetApiV1FacilitiesFacilityIdGallery.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1FacilitiesFacilityIdGallery.Responses.$200>
  }
  ['/api/v1/facilities/{facilityID}/gallery/assign-images']: {
    /**
     * postApiV1FacilitiesFacilityIdGalleryAssignImages - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1FacilitiesFacilityIdGalleryAssignImages.PathParameters> | null,
      data?: Paths.PostApiV1FacilitiesFacilityIdGalleryAssignImages.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1FacilitiesFacilityIdGalleryAssignImages.Responses.$200>
  }
  ['/api/v1/facilities/{facilityID}/gallery/reorder-images/{fileID}']: {
    /**
     * patchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId.PathParameters & Paths.PatchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId.QueryParameters> | null,
      data?: Paths.PatchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1FacilitiesFacilityIdGalleryReorderImagesFileId.Responses.$200>
  }
  ['/api/v1/facilities/{facilityID}/gallery/unassign-images/{fileID}']: {
    /**
     * deleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId.PathParameters & Paths.DeleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1FacilitiesFacilityIdGalleryUnassignImagesFileId.Responses.$200>
  }
  ['/api/v1/facilities/{facilityID}/facility-property-categories/']: {
    /**
     * getApiV1FacilitiesFacilityIdFacilityPropertyCategories - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_BROWSING, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1FacilitiesFacilityIdFacilityPropertyCategories.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1FacilitiesFacilityIdFacilityPropertyCategories.Responses.$200>
    /**
     * patchApiV1FacilitiesFacilityIdFacilityPropertyCategories - PERMISSION: [SUPER_ADMIN, ADMIN, FACILITY_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1FacilitiesFacilityIdFacilityPropertyCategories.PathParameters> | null,
      data?: Paths.PatchApiV1FacilitiesFacilityIdFacilityPropertyCategories.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1FacilitiesFacilityIdFacilityPropertyCategories.Responses.$200>
  }
  ['/api/v1/files/']: {
    /**
     * postApiV1Files - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT, ENUMS_DEFINITION, COMPANIES_EDIT, INSURANCE_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Files.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Files.Responses.$200>
  }
  ['/api/v1/files/{fileID}/set-tags']: {
    /**
     * patchApiV1FilesFileIdSetTags - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1FilesFileIdSetTags.PathParameters> | null,
      data?: Paths.PatchApiV1FilesFileIdSetTags.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1FilesFileIdSetTags.Responses.$200>
  }
  ['/api/v1/lines/']: {
    /**
     * getApiV1Lines - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Lines.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Lines.Responses.$200>
    /**
     * postApiV1Lines - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Lines.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Lines.Responses.$200>
  }
  ['/api/v1/lines/{lineID}']: {
    /**
     * getApiV1LinesLineId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineId.Responses.$200>
    /**
     * patchApiV1LinesLineId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1LinesLineId.PathParameters> | null,
      data?: Paths.PatchApiV1LinesLineId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesLineId.Responses.$200>
    /**
     * deleteApiV1LinesLineId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1LinesLineId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1LinesLineId.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/terms-with-term-stations']: {
    /**
     * getApiV1LinesLineIdTermsWithTermStations - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineIdTermsWithTermStations.PathParameters & Paths.GetApiV1LinesLineIdTermsWithTermStations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineIdTermsWithTermStations.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/stations/']: {
    /**
     * getApiV1LinesLineIdStations - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineIdStations.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineIdStations.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/stations/unassigned']: {
    /**
     * getApiV1LinesLineIdStationsUnassigned - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineIdStationsUnassigned.PathParameters & Paths.GetApiV1LinesLineIdStationsUnassigned.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineIdStationsUnassigned.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/stations/{stationID}']: {
    /**
     * postApiV1LinesLineIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1LinesLineIdStationsStationId.PathParameters> | null,
      data?: Paths.PostApiV1LinesLineIdStationsStationId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1LinesLineIdStationsStationId.Responses.$200>
    /**
     * patchApiV1LinesLineIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1LinesLineIdStationsStationId.PathParameters> | null,
      data?: Paths.PatchApiV1LinesLineIdStationsStationId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesLineIdStationsStationId.Responses.$200>
    /**
     * deleteApiV1LinesLineIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1LinesLineIdStationsStationId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1LinesLineIdStationsStationId.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/stations/{stationID}/reorder']: {
    /**
     * patchApiV1LinesLineIdStationsStationIdReorder - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1LinesLineIdStationsStationIdReorder.PathParameters> | null,
      data?: Paths.PatchApiV1LinesLineIdStationsStationIdReorder.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesLineIdStationsStationIdReorder.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/terms/{termID}/stations/']: {
    /**
     * getApiV1LinesLineIdTermsTermIdStations - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineIdTermsTermIdStations.PathParameters & Paths.GetApiV1LinesLineIdTermsTermIdStations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineIdTermsTermIdStations.Responses.$200>
    /**
     * deleteApiV1LinesLineIdTermsTermIdStations - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1LinesLineIdTermsTermIdStations.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1LinesLineIdTermsTermIdStations.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/terms/{termID}/stations/with-datetimes']: {
    /**
     * getApiV1LinesLineIdTermsTermIdStationsWithDatetimes - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineIdTermsTermIdStationsWithDatetimes.PathParameters & Paths.GetApiV1LinesLineIdTermsTermIdStationsWithDatetimes.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineIdTermsTermIdStationsWithDatetimes.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/terms/{termID}/stations/unassigned']: {
    /**
     * getApiV1LinesLineIdTermsTermIdStationsUnassigned - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineIdTermsTermIdStationsUnassigned.PathParameters & Paths.GetApiV1LinesLineIdTermsTermIdStationsUnassigned.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineIdTermsTermIdStationsUnassigned.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/terms/{termID}/stations/{stationID}']: {
    /**
     * postApiV1LinesLineIdTermsTermIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1LinesLineIdTermsTermIdStationsStationId.PathParameters> | null,
      data?: Paths.PostApiV1LinesLineIdTermsTermIdStationsStationId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1LinesLineIdTermsTermIdStationsStationId.Responses.$200>
    /**
     * patchApiV1LinesLineIdTermsTermIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationId.PathParameters> | null,
      data?: Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationId.Responses.$200>
    /**
     * deleteApiV1LinesLineIdTermsTermIdStationsStationId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1LinesLineIdTermsTermIdStationsStationId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1LinesLineIdTermsTermIdStationsStationId.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/terms/{termID}/stations/{stationID}/reorder']: {
    /**
     * patchApiV1LinesLineIdTermsTermIdStationsStationIdReorder - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationIdReorder.PathParameters> | null,
      data?: Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationIdReorder.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesLineIdTermsTermIdStationsStationIdReorder.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/unit-templates/']: {
    /**
     * getApiV1LinesLineIdUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_BROWSING, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineIdUnitTemplates.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineIdUnitTemplates.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/unit-templates/{unitTemplateID}']: {
    /**
     * postApiV1LinesLineIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1LinesLineIdUnitTemplatesUnitTemplateId.PathParameters> | null,
      data?: Paths.PostApiV1LinesLineIdUnitTemplatesUnitTemplateId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1LinesLineIdUnitTemplatesUnitTemplateId.Responses.$200>
    /**
     * patchApiV1LinesLineIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1LinesLineIdUnitTemplatesUnitTemplateId.PathParameters> | null,
      data?: Paths.PatchApiV1LinesLineIdUnitTemplatesUnitTemplateId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesLineIdUnitTemplatesUnitTemplateId.Responses.$200>
    /**
     * deleteApiV1LinesLineIdUnitTemplatesUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1LinesLineIdUnitTemplatesUnitTemplateId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1LinesLineIdUnitTemplatesUnitTemplateId.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/roads/']: {
    /**
     * getApiV1LinesLineIdRoads - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, PRODUCT_BROWSING, TRANSPORTATION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineIdRoads.PathParameters & Paths.GetApiV1LinesLineIdRoads.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineIdRoads.Responses.$200>
  }
  ['/api/v1/lines/roads/road-terms/']: {
    /**
     * postApiV1LinesRoadsRoadTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1LinesRoadsRoadTerms.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1LinesRoadsRoadTerms.Responses.$200>
    /**
     * patchApiV1LinesRoadsRoadTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PatchApiV1LinesRoadsRoadTerms.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesRoadsRoadTerms.Responses.$200>
  }
  ['/api/v1/lines/roads/{roadID}']: {
    /**
     * getApiV1LinesRoadsRoadId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesRoadsRoadId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesRoadsRoadId.Responses.$200>
    /**
     * patchApiV1LinesRoadsRoadId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1LinesRoadsRoadId.PathParameters> | null,
      data?: Paths.PatchApiV1LinesRoadsRoadId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesRoadsRoadId.Responses.$200>
    /**
     * deleteApiV1LinesRoadsRoadId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1LinesRoadsRoadId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1LinesRoadsRoadId.Responses.$200>
  }
  ['/api/v1/lines/roads/']: {
    /**
     * postApiV1LinesRoads - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1LinesRoads.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1LinesRoads.Responses.$200>
  }
  ['/api/v1/lines/roads/generate-roads']: {
    /**
     * postApiV1LinesRoadsGenerateRoads - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1LinesRoadsGenerateRoads.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1LinesRoadsGenerateRoads.Responses.$200>
  }
  ['/api/v1/lines/roads/bulk']: {
    /**
     * patchApiV1LinesRoadsBulk - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PatchApiV1LinesRoadsBulk.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesRoadsBulk.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/text-items/']: {
    /**
     * getApiV1LinesLineIdTextItems - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT, TRANSPORTATION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1LinesLineIdTextItems.PathParameters & Paths.GetApiV1LinesLineIdTextItems.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1LinesLineIdTextItems.Responses.$200>
  }
  ['/api/v1/lines/{lineID}/text-items/{textItemID}']: {
    /**
     * patchApiV1LinesLineIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, TRANSPORTATION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1LinesLineIdTextItemsTextItemId.PathParameters & Paths.PatchApiV1LinesLineIdTextItemsTextItemId.QueryParameters> | null,
      data?: Paths.PatchApiV1LinesLineIdTextItemsTextItemId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1LinesLineIdTextItemsTextItemId.Responses.$200>
  }
  ['/api/v1/file-tags/{id}']: {
    /**
     * deleteApiV1FileTagsId - PERMISSION: [SUPER_ADMIN, ADMIN, FILES_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1FileTagsId.PathParameters & Paths.DeleteApiV1FileTagsId.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1FileTagsId.Responses.$200>
  }
  ['/api/v1/term-serials/{termSerialID}/terms/']: {
    /**
     * getApiV1TermSerialsTermSerialIdTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1TermSerialsTermSerialIdTerms.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1TermSerialsTermSerialIdTerms.Responses.$200>
    /**
     * postApiV1TermSerialsTermSerialIdTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1TermSerialsTermSerialIdTerms.PathParameters> | null,
      data?: Paths.PostApiV1TermSerialsTermSerialIdTerms.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1TermSerialsTermSerialIdTerms.Responses.$200>
  }
  ['/api/v1/term-serials/terms/']: {
    /**
     * getApiV1TermSerialsTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT, TRANSPORTATION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1TermSerialsTerms.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1TermSerialsTerms.Responses.$200>
    /**
     * patchApiV1TermSerialsTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PatchApiV1TermSerialsTerms.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1TermSerialsTerms.Responses.$200>
    /**
     * deleteApiV1TermSerialsTerms - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1TermSerialsTerms.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1TermSerialsTerms.Responses.$200>
  }
  ['/api/v1/term-serials/terms/generate']: {
    /**
     * postApiV1TermSerialsTermsGenerate - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1TermSerialsTermsGenerate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1TermSerialsTermsGenerate.Responses.$200>
  }
  ['/api/v1/term-serials/']: {
    /**
     * getApiV1TermSerials - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1TermSerials.Responses.$200>
    /**
     * postApiV1TermSerials - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1TermSerials.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1TermSerials.Responses.$200>
  }
  ['/api/v1/term-serials/{id}']: {
    /**
     * getApiV1TermSerialsId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1TermSerialsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1TermSerialsId.Responses.$200>
    /**
     * patchApiV1TermSerialsId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1TermSerialsId.PathParameters> | null,
      data?: Paths.PatchApiV1TermSerialsId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1TermSerialsId.Responses.$200>
    /**
     * deleteApiV1TermSerialsId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1TermSerialsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1TermSerialsId.Responses.$200>
  }
  ['/api/v1/term-serials/destination-seasons/{destinationSeasonID}']: {
    /**
     * getApiV1TermSerialsDestinationSeasonsDestinationSeasonId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1TermSerialsDestinationSeasonsDestinationSeasonId.PathParameters & Paths.GetApiV1TermSerialsDestinationSeasonsDestinationSeasonId.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1TermSerialsDestinationSeasonsDestinationSeasonId.Responses.$200>
  }
  ['/api/v1/destination-seasons/']: {
    /**
     * getApiV1DestinationSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING, DISCOUNT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasons.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasons.Responses.$200>
    /**
     * postApiV1DestinationSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1DestinationSeasons.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1DestinationSeasons.Responses.$200>
  }
  ['/api/v1/destination-seasons/export']: {
    /**
     * getApiV1DestinationSeasonsExport - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsExport.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}']: {
    /**
     * getApiV1DestinationSeasonsDestinationSeasonId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonId.Responses.$200>
    /**
     * patchApiV1DestinationSeasonsDestinationSeasonId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonId.PathParameters> | null,
      data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonId.Responses.$200>
    /**
     * deleteApiV1DestinationSeasonsDestinationSeasonId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonId.Responses.$200>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}/has-unpublished-prices']: {
    /**
     * getApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices.PathParameters & Paths.GetApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdHasUnpublishedPrices.Responses.$200>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}/errors']: {
    /**
     * getApiV1DestinationSeasonsDestinationSeasonIdErrors - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdErrors.PathParameters & Paths.GetApiV1DestinationSeasonsDestinationSeasonIdErrors.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdErrors.Responses.$200>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}/warnings']: {
    /**
     * getApiV1DestinationSeasonsDestinationSeasonIdWarnings - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdWarnings.PathParameters & Paths.GetApiV1DestinationSeasonsDestinationSeasonIdWarnings.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdWarnings.Responses.$200>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}/general-pricelist-items/']: {
    /**
     * getApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.PathParameters & Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.Responses.$200>
    /**
     * postApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.PathParameters> | null,
      data?: Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItems.Responses.$200>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}/general-pricelist-items/{generalPricelistItemID}']: {
    /**
     * getApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING, PRODUCT_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.Responses.$200>
    /**
     * patchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.PathParameters> | null,
      data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.Responses.$200>
    /**
     * deleteApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemId.Responses.$200>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}/general-pricelist-items/{generalPricelistItemID}/cost-seasons/']: {
    /**
     * getApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.Responses.$200>
    /**
     * patchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.PathParameters> | null,
      data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralPricelistItemsGeneralPricelistItemIdCostSeasons.Responses.$200>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}/general-insurances/{generalInsuranceID}']: {
    /**
     * getApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING, PRODUCT_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.Responses.$200>
    /**
     * patchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.PathParameters> | null,
      data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.Responses.$200>
    /**
     * deleteApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceId.Responses.$200>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}/general-insurances/']: {
    /**
     * postApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances.PathParameters> | null,
      data?: Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurances.Responses.$200>
  }
  ['/api/v1/destination-seasons/{destinationSeasonID}/general-insurances/{generalInsuranceID}/cost-seasons/']: {
    /**
     * getApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.Responses.$200>
    /**
     * patchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.PathParameters> | null,
      data?: Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1DestinationSeasonsDestinationSeasonIdGeneralInsurancesGeneralInsuranceIdCostSeasons.Responses.$200>
  }
  ['/api/v1/services/{serviceID}']: {
    /**
     * getApiV1ServicesServiceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceId.Responses.$200>
    /**
     * patchApiV1ServicesServiceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceId.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceId.Responses.$200>
    /**
     * deleteApiV1ServicesServiceId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1ServicesServiceId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1ServicesServiceId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/available-term-nights']: {
    /**
     * getApiV1ServicesServiceIdAvailableTermNights - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdAvailableTermNights.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdAvailableTermNights.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/meal-plans']: {
    /**
     * getApiV1ServicesServiceIdMealPlans - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdMealPlans.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdMealPlans.Responses.$200>
  }
  ['/api/v1/services/']: {
    /**
     * postApiV1Services - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1Services.QueryParameters> | null,
      data?: Paths.PostApiV1Services.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Services.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/apply-price-and-cost-calculations']: {
    /**
     * patchApiV1ServicesServiceIdApplyPriceAndCostCalculations - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdApplyPriceAndCostCalculations.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdApplyPriceAndCostCalculations.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdApplyPriceAndCostCalculations.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/']: {
    /**
     * getApiV1ServicesServiceIdUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplates.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplates.Responses.$200>
    /**
     * postApiV1ServicesServiceIdUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1ServicesServiceIdUnitTemplates.PathParameters> | null,
      data?: Paths.PostApiV1ServicesServiceIdUnitTemplates.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1ServicesServiceIdUnitTemplates.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}']: {
    /**
     * deleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/pricelist-items/{pricelistItemID}']: {
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsPricelistItemId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/pricelist-items/{serviceUnitTemplatePricelistItemID}']: {
    /**
     * deleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/pricelist-items/cost-seasons/reference']: {
    /**
     * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsCostSeasonsReference - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsCostSeasonsReference.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsCostSeasonsReference.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/pricelist-items/{serviceUnitTemplatePricelistItemID}/term-price/']: {
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPrice.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/pricelist-items/{serviceUnitTemplatePricelistItemID}/term-price/bulk']: {
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdTermPriceBulk.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/pricelist-items/{serviceUnitTemplatePricelistItemID}/individual-pricelist-items/{individualPricelistItemID}']: {
    /**
     * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.Responses.$200>
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdIndividualPricelistItemsIndividualPricelistItemId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/pricelist-items/{serviceUnitTemplatePricelistItemID}/cost-seasons/']: {
    /**
     * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.Responses.$200>
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdPricelistItemsServiceUnitTemplatePricelistItemIdCostSeasons.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/term-capacity/']: {
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity.PathParameters & Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity.QueryParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacity.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/term-capacity/bulk']: {
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk.PathParameters & Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk.QueryParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermCapacityBulk.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/term-discount/']: {
    /**
     * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_BROWSING, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.Responses.$200>
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT, PRODUCT_BROWSING]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscount.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/term-discount/bulk']: {
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT, PRODUCT_BROWSING]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermDiscountBulk.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/term-note/']: {
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdTermNote.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/unit-templates/{serviceUnitTemplateID}/individual-unit-templates/{individualUnitTemplateID}']: {
    /**
     * getApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.Responses.$200>
    /**
     * patchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdUnitTemplatesServiceUnitTemplateIdIndividualUnitTemplatesIndividualUnitTemplateId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/service-term-serial-lines/{termSerialID}']: {
    /**
     * postApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId.PathParameters> | null,
      data?: Paths.PostApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1ServicesServiceIdServiceTermSerialLinesTermSerialId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/service-term-serial-facilities/{termSerialID}']: {
    /**
     * postApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId.PathParameters> | null,
      data?: Paths.PostApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1ServicesServiceIdServiceTermSerialFacilitiesTermSerialId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/gallery/']: {
    /**
     * getApiV1ServicesServiceIdGallery - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdGallery.PathParameters & Paths.GetApiV1ServicesServiceIdGallery.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdGallery.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/gallery/assign-images']: {
    /**
     * postApiV1ServicesServiceIdGalleryAssignImages - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1ServicesServiceIdGalleryAssignImages.PathParameters> | null,
      data?: Paths.PostApiV1ServicesServiceIdGalleryAssignImages.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1ServicesServiceIdGalleryAssignImages.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/gallery/reorder-images/{fileID}']: {
    /**
     * patchApiV1ServicesServiceIdGalleryReorderImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdGalleryReorderImagesFileId.PathParameters & Paths.PatchApiV1ServicesServiceIdGalleryReorderImagesFileId.QueryParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdGalleryReorderImagesFileId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdGalleryReorderImagesFileId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/gallery/unassign-images/{fileID}']: {
    /**
     * deleteApiV1ServicesServiceIdGalleryUnassignImagesFileId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1ServicesServiceIdGalleryUnassignImagesFileId.PathParameters & Paths.DeleteApiV1ServicesServiceIdGalleryUnassignImagesFileId.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1ServicesServiceIdGalleryUnassignImagesFileId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/text-items/']: {
    /**
     * getApiV1ServicesServiceIdTextItems - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ServicesServiceIdTextItems.PathParameters & Paths.GetApiV1ServicesServiceIdTextItems.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ServicesServiceIdTextItems.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/text-items/{textItemID}']: {
    /**
     * patchApiV1ServicesServiceIdTextItemsTextItemId - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdTextItemsTextItemId.PathParameters & Paths.PatchApiV1ServicesServiceIdTextItemsTextItemId.QueryParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdTextItemsTextItemId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdTextItemsTextItemId.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/terms/{termID}/set-forbidden-individual-transport']: {
    /**
     * patchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdTermsTermIdSetForbiddenIndividualTransport.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/terms/set-forbidden-individual-transport/bulk']: {
    /**
     * patchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdTermsSetForbiddenIndividualTransportBulk.Responses.$200>
  }
  ['/api/v1/services/{serviceID}/terms/{termID}/price-groups/']: {
    /**
     * patchApiV1ServicesServiceIdTermsTermIdPriceGroups - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1ServicesServiceIdTermsTermIdPriceGroups.PathParameters> | null,
      data?: Paths.PatchApiV1ServicesServiceIdTermsTermIdPriceGroups.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1ServicesServiceIdTermsTermIdPriceGroups.Responses.$200>
  }
  ['/api/v1/companies/']: {
    /**
     * getApiV1Companies - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Companies.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Companies.Responses.$200>
    /**
     * postApiV1Companies - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Companies.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Companies.Responses.$200>
  }
  ['/api/v1/companies/{companyID}']: {
    /**
     * getApiV1CompaniesCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT, COMPANIES_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1CompaniesCompanyId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1CompaniesCompanyId.Responses.$200>
    /**
     * patchApiV1CompaniesCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1CompaniesCompanyId.PathParameters> | null,
      data?: Paths.PatchApiV1CompaniesCompanyId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1CompaniesCompanyId.Responses.$200>
    /**
     * deleteApiV1CompaniesCompanyId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1CompaniesCompanyId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1CompaniesCompanyId.Responses.$200>
  }
  ['/api/v1/companies/{companyID}/company-branches']: {
    /**
     * getApiV1CompaniesCompanyIdCompanyBranches - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT, COMPANIES_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1CompaniesCompanyIdCompanyBranches.PathParameters & Paths.GetApiV1CompaniesCompanyIdCompanyBranches.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1CompaniesCompanyIdCompanyBranches.Responses.$200>
  }
  ['/api/v1/company-branches/']: {
    /**
     * getApiV1CompanyBranches - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT, BUSINESS_CASES_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1CompanyBranches.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1CompanyBranches.Responses.$200>
    /**
     * postApiV1CompanyBranches - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1CompanyBranches.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1CompanyBranches.Responses.$200>
  }
  ['/api/v1/company-branches/{companyBranchID}']: {
    /**
     * getApiV1CompanyBranchesCompanyBranchId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1CompanyBranchesCompanyBranchId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1CompanyBranchesCompanyBranchId.Responses.$200>
    /**
     * patchApiV1CompanyBranchesCompanyBranchId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1CompanyBranchesCompanyBranchId.PathParameters> | null,
      data?: Paths.PatchApiV1CompanyBranchesCompanyBranchId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1CompanyBranchesCompanyBranchId.Responses.$200>
    /**
     * deleteApiV1CompanyBranchesCompanyBranchId - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1CompanyBranchesCompanyBranchId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1CompanyBranchesCompanyBranchId.Responses.$200>
  }
  ['/api/v1/company-branches/{companyBranchID}/organizations']: {
    /**
     * getApiV1CompanyBranchesCompanyBranchIdOrganizations - PERMISSION: [SUPER_ADMIN, ADMIN, COMPANIES_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1CompanyBranchesCompanyBranchIdOrganizations.PathParameters & Paths.GetApiV1CompanyBranchesCompanyBranchIdOrganizations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1CompanyBranchesCompanyBranchIdOrganizations.Responses.$200>
  }
  ['/api/v1/organizations/']: {
    /**
     * getApiV1Organizations - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Organizations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Organizations.Responses.$200>
    /**
     * postApiV1Organizations - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Organizations.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Organizations.Responses.$200>
  }
  ['/api/v1/organizations/{id}']: {
    /**
     * getApiV1OrganizationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1OrganizationsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1OrganizationsId.Responses.$200>
    /**
     * patchApiV1OrganizationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1OrganizationsId.PathParameters> | null,
      data?: Paths.PatchApiV1OrganizationsId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1OrganizationsId.Responses.$200>
    /**
     * deleteApiV1OrganizationsId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1OrganizationsId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1OrganizationsId.Responses.$200>
  }
  ['/api/v1/organizations/{id}/organization-branches']: {
    /**
     * getApiV1OrganizationsIdOrganizationBranches - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1OrganizationsIdOrganizationBranches.PathParameters & Paths.GetApiV1OrganizationsIdOrganizationBranches.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1OrganizationsIdOrganizationBranches.Responses.$200>
  }
  ['/api/v1/organization-branches/{id}']: {
    /**
     * getApiV1OrganizationBranchesId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1OrganizationBranchesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1OrganizationBranchesId.Responses.$200>
    /**
     * patchApiV1OrganizationBranchesId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1OrganizationBranchesId.PathParameters> | null,
      data?: Paths.PatchApiV1OrganizationBranchesId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1OrganizationBranchesId.Responses.$200>
    /**
     * deleteApiV1OrganizationBranchesId - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1OrganizationBranchesId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1OrganizationBranchesId.Responses.$200>
  }
  ['/api/v1/organization-branches/']: {
    /**
     * postApiV1OrganizationBranches - PERMISSION: [SUPER_ADMIN, ADMIN, ORGANIZATIONS_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1OrganizationBranches.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1OrganizationBranches.Responses.$200>
  }
  ['/api/v1/business-cases/{businessCaseID}/travelers/']: {
    /**
     * getApiV1BusinessCasesBusinessCaseIdTravelers - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT, BUSINESS_CASES_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1BusinessCasesBusinessCaseIdTravelers.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1BusinessCasesBusinessCaseIdTravelers.Responses.$200>
  }
  ['/api/v1/business-cases/{businessCaseID}/travelers/{travelerID}']: {
    /**
     * patchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId.PathParameters> | null,
      data?: Paths.PatchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1BusinessCasesBusinessCaseIdTravelersTravelerId.Responses.$200>
  }
  ['/api/v1/business-cases/{businessCaseID}/notes/']: {
    /**
     * getApiV1BusinessCasesBusinessCaseIdNotes - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1BusinessCasesBusinessCaseIdNotes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1BusinessCasesBusinessCaseIdNotes.Responses.$200>
    /**
     * postApiV1BusinessCasesBusinessCaseIdNotes - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1BusinessCasesBusinessCaseIdNotes.PathParameters> | null,
      data?: Paths.PostApiV1BusinessCasesBusinessCaseIdNotes.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1BusinessCasesBusinessCaseIdNotes.Responses.$200>
  }
  ['/api/v1/business-cases/{businessCaseID}/notes/{businessCaseNoteID}']: {
    /**
     * deleteApiV1BusinessCasesBusinessCaseIdNotesBusinessCaseNoteId - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1BusinessCasesBusinessCaseIdNotesBusinessCaseNoteId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1BusinessCasesBusinessCaseIdNotesBusinessCaseNoteId.Responses.$200>
  }
  ['/api/v1/business-cases/']: {
    /**
     * getApiV1BusinessCases - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1BusinessCases.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1BusinessCases.Responses.$200>
  }
  ['/api/v1/business-cases/{businessCaseID}']: {
    /**
     * getApiV1BusinessCasesBusinessCaseId - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_BROWSING, BUSINESS_CASES_EDIT]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1BusinessCasesBusinessCaseId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1BusinessCasesBusinessCaseId.Responses.$200>
  }
  ['/api/v1/customers/']: {
    /**
     * getApiV1Customers - PERMISSION: [SUPER_ADMIN, ADMIN, CUSTOMERS_BROWSING, BUSINESS_CASES_BROWSING, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Customers.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Customers.Responses.$200>
  }
  ['/api/v1/customers/{customerID}']: {
    /**
     * getApiV1CustomersCustomerId - PERMISSION: [SUPER_ADMIN, ADMIN, CUSTOMERS_BROWSING, BUSINESS_CASES_BROWSING, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1CustomersCustomerId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1CustomersCustomerId.Responses.$200>
  }
  ['/api/v1/people/']: {
    /**
     * getApiV1People - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT, BUSINESS_CASES_BROWSING, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1People.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1People.Responses.$200>
  }
  ['/api/v1/people/{personID}']: {
    /**
     * getApiV1PeoplePersonId - PERMISSION: [SUPER_ADMIN, ADMIN, BUSINESS_CASES_EDIT, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1PeoplePersonId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1PeoplePersonId.Responses.$200>
  }
  ['/api/v1/products/']: {
    /**
     * getApiV1Products - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Products.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/products/destinations']: {
    /**
     * getApiV1ProductsDestinations - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ProductsDestinations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ProductsDestinations.Responses.$200>
  }
  ['/api/v1/products/stations']: {
    /**
     * getApiV1ProductsStations - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ProductsStations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ProductsStations.Responses.$200>
  }
  ['/api/v1/products/available-stations']: {
    /**
     * getApiV1ProductsAvailableStations - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ProductsAvailableStations.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/products/person-type']: {
    /**
     * getApiV1ProductsPersonType - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1ProductsPersonType.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1ProductsPersonType.Responses.$200>
  }
  ['/api/v1/products/additional-services']: {
    /**
     * postApiV1ProductsAdditionalServices - PERMISSION: [SUPER_ADMIN, ADMIN, PRODUCT_BROWSING, SALES]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1ProductsAdditionalServices.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/products/price']: {
    /**
     * postApiV1ProductsPrice - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1ProductsPrice.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/products/price/travelers']: {
    /**
     * postApiV1ProductsPriceTravelers - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1ProductsPriceTravelers.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/products/reservation']: {
    /**
     * postApiV1ProductsReservation - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1ProductsReservation.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1ProductsReservation.Responses.$200>
  }
  ['/api/v1/products/check-availability']: {
    /**
     * postApiV1ProductsCheckAvailability - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1ProductsCheckAvailability.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/api/v1/discounts/']: {
    /**
     * getApiV1Discounts - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Discounts.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Discounts.Responses.$200>
    /**
     * postApiV1Discounts - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Discounts.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Discounts.Responses.$200>
  }
  ['/api/v1/discounts/service-unit-templates']: {
    /**
     * getApiV1DiscountsServiceUnitTemplates - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DiscountsServiceUnitTemplates.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DiscountsServiceUnitTemplates.Responses.$200>
  }
  ['/api/v1/discounts/{discountID}']: {
    /**
     * getApiV1DiscountsDiscountId - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT, DISCOUNT_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DiscountsDiscountId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DiscountsDiscountId.Responses.$200>
    /**
     * patchApiV1DiscountsDiscountId - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1DiscountsDiscountId.PathParameters> | null,
      data?: Paths.PatchApiV1DiscountsDiscountId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1DiscountsDiscountId.Responses.$200>
    /**
     * deleteApiV1DiscountsDiscountId - PERMISSION: [SUPER_ADMIN, ADMIN, DISCOUNT_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1DiscountsDiscountId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1DiscountsDiscountId.Responses.$200>
  }
  ['/api/v1/insurances/']: {
    /**
     * getApiV1Insurances - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Insurances.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Insurances.Responses.$200>
    /**
     * postApiV1Insurances - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Insurances.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Insurances.Responses.$200>
  }
  ['/api/v1/insurances/{insuranceID}']: {
    /**
     * getApiV1InsurancesInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_EDIT, INSURANCE_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1InsurancesInsuranceId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1InsurancesInsuranceId.Responses.$200>
    /**
     * patchApiV1InsurancesInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1InsurancesInsuranceId.PathParameters> | null,
      data?: Paths.PatchApiV1InsurancesInsuranceId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1InsurancesInsuranceId.Responses.$200>
    /**
     * deleteApiV1InsurancesInsuranceId - PERMISSION: [SUPER_ADMIN, ADMIN, INSURANCE_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1InsurancesInsuranceId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1InsurancesInsuranceId.Responses.$200>
  }
  ['/api/v1/documents/reservations/{reservationID}/']: {
    /**
     * getApiV1DocumentsReservationsReservationId - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DocumentsReservationsReservationId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DocumentsReservationsReservationId.Responses.$200>
  }
  ['/api/v1/documents/reservations/{reservationID}/export']: {
    /**
     * getApiV1DocumentsReservationsReservationIdExport - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1DocumentsReservationsReservationIdExport.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1DocumentsReservationsReservationIdExport.Responses.$200>
  }
  ['/api/v1/documents/reservations/{reservationID}/send']: {
    /**
     * postApiV1DocumentsReservationsReservationIdSend - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'post'(
      parameters?: Parameters<Paths.PostApiV1DocumentsReservationsReservationIdSend.PathParameters> | null,
      data?: Paths.PostApiV1DocumentsReservationsReservationIdSend.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1DocumentsReservationsReservationIdSend.Responses.$200>
  }
  ['/api/v1/documents/reservation-calculations/export']: {
    /**
     * postApiV1DocumentsReservationCalculationsExport - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1DocumentsReservationCalculationsExport.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1DocumentsReservationCalculationsExport.Responses.$200>
  }
  ['/api/v1/documents/reservation-calculations/send']: {
    /**
     * postApiV1DocumentsReservationCalculationsSend - PERMISSION: [SUPER_ADMIN, ADMIN, SALES]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1DocumentsReservationCalculationsSend.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1DocumentsReservationCalculationsSend.Responses.$200>
  }
  ['/api/v1/payments/']: {
    /**
     * postApiV1Payments - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Payments.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Payments.Responses.$200>
    /**
     * getApiV1Payments - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT, PAYMENTS_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Payments.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Payments.Responses.$200>
  }
  ['/api/v1/payments/{paymentID}']: {
    /**
     * patchApiV1PaymentsPaymentId - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1PaymentsPaymentId.PathParameters> | null,
      data?: Paths.PatchApiV1PaymentsPaymentId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1PaymentsPaymentId.Responses.$200>
    /**
     * getApiV1PaymentsPaymentId - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT, PAYMENTS_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1PaymentsPaymentId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1PaymentsPaymentId.Responses.$200>
    /**
     * deleteApiV1PaymentsPaymentId - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1PaymentsPaymentId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1PaymentsPaymentId.Responses.$200>
  }
  ['/api/v1/payments/{paymentID}/logs']: {
    /**
     * getApiV1PaymentsPaymentIdLogs - PERMISSION: [SUPER_ADMIN, ADMIN, PAYMENTS_EDIT, PAYMENTS_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1PaymentsPaymentIdLogs.PathParameters & Paths.GetApiV1PaymentsPaymentIdLogs.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1PaymentsPaymentIdLogs.Responses.$200>
  }
  ['/api/v1/commisions/']: {
    /**
     * getApiV1Commisions - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1Commisions.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1Commisions.Responses.$200>
    /**
     * postApiV1Commisions - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_EDIT]
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiV1Commisions.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiV1Commisions.Responses.$200>
  }
  ['/api/v1/commisions/{commisionID}']: {
    /**
     * getApiV1CommisionsCommisionId - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_BROWSING]
     */
    'get'(
      parameters?: Parameters<Paths.GetApiV1CommisionsCommisionId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiV1CommisionsCommisionId.Responses.$200>
    /**
     * patchApiV1CommisionsCommisionId - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_EDIT]
     */
    'patch'(
      parameters?: Parameters<Paths.PatchApiV1CommisionsCommisionId.PathParameters> | null,
      data?: Paths.PatchApiV1CommisionsCommisionId.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiV1CommisionsCommisionId.Responses.$200>
    /**
     * deleteApiV1CommisionsCommisionId - PERMISSION: [SUPER_ADMIN, ADMIN, COMMISSION_EDIT]
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiV1CommisionsCommisionId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteApiV1CommisionsCommisionId.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
