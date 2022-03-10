import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace Paths {
    namespace GetApiB2BAdminEnumsCountries {
        namespace Responses {
            export interface $200 {
                countries: {
                    code: string;
                    currencyCode: string;
                    flag: string | null;
                    phonePrefix: string;
                }[];
            }
        }
    }
    namespace PatchApiB2BV1UsersWelcomeScreen {
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
    namespace PostApiB2BAdminAuthForgotPassword {
        export interface RequestBody {
            /**
             * example:
             * test.confirmed_user@goodrequest.com
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
        export interface RequestBody {
            /**
             * example:
             * test.confirmed_user@goodrequest.com
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
                };
            }
        }
    }
    namespace PostApiB2BAdminAuthLogout {
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
        export interface RequestBody {
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
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
    namespace PostApiB2BAdminUsersActivation {
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
            countryCode: string;
            /**
             * example:
             * xxx xxx xxx
             */
            phone: string;
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
                };
            }
        }
    }
    namespace PostApiB2BV1AuthForgotPassword {
        export interface RequestBody {
            /**
             * example:
             * test.confirmed_user@goodrequest.com
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
        export interface RequestBody {
            /**
             * example:
             * test.confirmed_user@goodrequest.com
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
                };
            }
        }
    }
    namespace PostApiB2BV1AuthLogout {
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
        export interface RequestBody {
            password: string; // (?=.{8,})^(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*\d+)
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
    namespace PostApiB2BV1UsersActivation {
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
            countryCode: string;
            /**
             * example:
             * xxx xxx xxx
             */
            phone: string;
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
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BAdminAuthRefreshToken.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthRefreshToken.Responses.$200>
  /**
   * postApiB2BAdminAuthLogout - PERMISSION: NO
   */
  'postApiB2BAdminAuthLogout'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BAdminAuthLogout.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthLogout.Responses.$200>
  /**
   * postApiB2BAdminAuthForgotPassword - PERMISSION: NO
   */
  'postApiB2BAdminAuthForgotPassword'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BAdminAuthForgotPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthForgotPassword.Responses.$200>
  /**
   * postApiB2BAdminAuthResetPassword - PERMISSION: NO
   */
  'postApiB2BAdminAuthResetPassword'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BAdminAuthResetPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthResetPassword.Responses.$200>
  /**
   * postApiB2BAdminUsersRegistration - PERMISSION: NO
   */
  'postApiB2BAdminUsersRegistration'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BAdminUsersRegistration.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminUsersRegistration.Responses.$200>
  /**
   * postApiB2BAdminUsersActivation - PERMISSION: NO
   */
  'postApiB2BAdminUsersActivation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BAdminUsersActivation.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminUsersActivation.Responses.$200>
  /**
   * postApiB2BAdminUsersActivationResend - PERMISSION: NO
   */
  'postApiB2BAdminUsersActivationResend'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BAdminUsersActivationResend.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminUsersActivationResend.Responses.$200>
  /**
   * getApiB2BAdminEnumsCountries - PERMISSION: NO
   */
  'getApiB2BAdminEnumsCountries'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetApiB2BAdminEnumsCountries.Responses.$200>
  /**
   * postApiB2BV1AuthLogin - PERMISSION: NO
   */
  'postApiB2BV1AuthLogin'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1AuthLogin.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthLogin.Responses.$200>
  /**
   * postApiB2BV1AuthRefreshToken - PERMISSION: NO
   */
  'postApiB2BV1AuthRefreshToken'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1AuthRefreshToken.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthRefreshToken.Responses.$200>
  /**
   * postApiB2BV1AuthLogout - PERMISSION: NO
   */
  'postApiB2BV1AuthLogout'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1AuthLogout.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthLogout.Responses.$200>
  /**
   * postApiB2BV1AuthForgotPassword - PERMISSION: NO
   */
  'postApiB2BV1AuthForgotPassword'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1AuthForgotPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthForgotPassword.Responses.$200>
  /**
   * postApiB2BV1AuthResetPassword - PERMISSION: NO
   */
  'postApiB2BV1AuthResetPassword'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1AuthResetPassword.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1AuthResetPassword.Responses.$200>
  /**
   * postApiB2BV1UsersRegistration - PERMISSION: NO
   */
  'postApiB2BV1UsersRegistration'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1UsersRegistration.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1UsersRegistration.Responses.$200>
  /**
   * postApiB2BV1UsersActivation - PERMISSION: NO
   */
  'postApiB2BV1UsersActivation'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1UsersActivation.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1UsersActivation.Responses.$200>
  /**
   * postApiB2BV1UsersActivationResend - PERMISSION: NO
   */
  'postApiB2BV1UsersActivationResend'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BV1UsersActivationResend.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BV1UsersActivationResend.Responses.$200>
  /**
   * patchApiB2BV1UsersWelcomeScreen - PERMISSION: NO
   */
  'patchApiB2BV1UsersWelcomeScreen'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PatchApiB2BV1UsersWelcomeScreen.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PatchApiB2BV1UsersWelcomeScreen.Responses.$200>
  /**
   * postApiB2BAdminAuthLogin - PERMISSION: NO
   */
  'postApiB2BAdminAuthLogin'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostApiB2BAdminAuthLogin.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostApiB2BAdminAuthLogin.Responses.$200>
}

export interface PathsDictionary {
  ['/api/b2b/admin/auth/refresh-token']: {
    /**
     * postApiB2BAdminAuthRefreshToken - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BAdminAuthRefreshToken.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthRefreshToken.Responses.$200>
  }
  ['/api/b2b/admin/auth/logout']: {
    /**
     * postApiB2BAdminAuthLogout - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BAdminAuthLogout.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthLogout.Responses.$200>
  }
  ['/api/b2b/admin/auth/forgot-password']: {
    /**
     * postApiB2BAdminAuthForgotPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BAdminAuthForgotPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthForgotPassword.Responses.$200>
  }
  ['/api/b2b/admin/auth/reset-password']: {
    /**
     * postApiB2BAdminAuthResetPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BAdminAuthResetPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthResetPassword.Responses.$200>
  }
  ['/api/b2b/admin/users/registration']: {
    /**
     * postApiB2BAdminUsersRegistration - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BAdminUsersRegistration.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminUsersRegistration.Responses.$200>
  }
  ['/api/b2b/admin/users/activation']: {
    /**
     * postApiB2BAdminUsersActivation - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BAdminUsersActivation.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminUsersActivation.Responses.$200>
  }
  ['/api/b2b/admin/users/activation-resend']: {
    /**
     * postApiB2BAdminUsersActivationResend - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BAdminUsersActivationResend.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminUsersActivationResend.Responses.$200>
  }
  ['/api/b2b/admin/enums/countries']: {
    /**
     * getApiB2BAdminEnumsCountries - PERMISSION: NO
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetApiB2BAdminEnumsCountries.Responses.$200>
  }
  ['/api/b2b/v1/auth/login']: {
    /**
     * postApiB2BV1AuthLogin - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1AuthLogin.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthLogin.Responses.$200>
  }
  ['/api/b2b/v1/auth/refresh-token']: {
    /**
     * postApiB2BV1AuthRefreshToken - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1AuthRefreshToken.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthRefreshToken.Responses.$200>
  }
  ['/api/b2b/v1/auth/logout']: {
    /**
     * postApiB2BV1AuthLogout - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1AuthLogout.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthLogout.Responses.$200>
  }
  ['/api/b2b/v1/auth/forgot-password']: {
    /**
     * postApiB2BV1AuthForgotPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1AuthForgotPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthForgotPassword.Responses.$200>
  }
  ['/api/b2b/v1/auth/reset-password']: {
    /**
     * postApiB2BV1AuthResetPassword - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1AuthResetPassword.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1AuthResetPassword.Responses.$200>
  }
  ['/api/b2b/v1/users/registration']: {
    /**
     * postApiB2BV1UsersRegistration - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1UsersRegistration.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1UsersRegistration.Responses.$200>
  }
  ['/api/b2b/v1/users/activation']: {
    /**
     * postApiB2BV1UsersActivation - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1UsersActivation.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1UsersActivation.Responses.$200>
  }
  ['/api/b2b/v1/users/activation-resend']: {
    /**
     * postApiB2BV1UsersActivationResend - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BV1UsersActivationResend.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BV1UsersActivationResend.Responses.$200>
  }
  ['/api/b2b/v1/users/welcome-screen']: {
    /**
     * patchApiB2BV1UsersWelcomeScreen - PERMISSION: NO
     */
    'patch'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PatchApiB2BV1UsersWelcomeScreen.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PatchApiB2BV1UsersWelcomeScreen.Responses.$200>
  }
  ['/api/b2b/admin/auth/login']: {
    /**
     * postApiB2BAdminAuthLogin - PERMISSION: NO
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostApiB2BAdminAuthLogin.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostApiB2BAdminAuthLogin.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
