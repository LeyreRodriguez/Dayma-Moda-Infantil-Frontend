interface TokenClientResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  id_token?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: TokenClientResponse) => void;
  error_callback?: (error: { type: string; message: string }) => void;
  prompt?: string;
  state?: string;
  enable_serial_consent?: boolean;
  hint?: string;
  hosted_domain?: string;
  login_hint?: string;
  nonce?: string;
  ux_mode?: "popup" | "redirect";
  redirect_uri?: string;
  select_account?: boolean;
  request_id?: string;
}

interface GoogleOAuth2 {
  initTokenClient: (config: TokenClientConfig) => {
    requestAccessToken: (overrideConfig?: Partial<TokenClientConfig>) => void;
  };
  initCodeClient: (config: TokenClientConfig) => {
    requestCode: () => void;
  };
  hasGrantedAnyScope: (
    tokenResponse: TokenClientResponse,
    ...scopes: string[]
  ) => boolean;
  hasGrantedAllScopes: (
    tokenResponse: TokenClientResponse,
    ...scopes: string[]
  ) => boolean;
  revoke: (accessToken: string, done: () => void) => void;
}

interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: { credential: string }) => void;
      auto_select?: boolean;
      cancel_on_tap_outside?: boolean;
      context?: string;
      state_cookie_domain?: string;
      ux_mode?: "popup" | "redirect";
      allowed_parent_origin?: string | string[];
      intermediate_iframe_close_callback?: () => void;
      itp_support?: boolean;
      login_uri?: string;
      native_callback?: (...args: unknown[]) => void;
    }) => void;
    prompt: (momentListener?: (moment: string) => void) => void;
    renderButton: (
      parent: HTMLElement,
      options: {
        type?: "standard" | "icon";
        theme?: "outline" | "filled_blue" | "filled_black";
        size?: "large" | "medium" | "small";
        text?: "signin_with" | "signup_with" | "continue_with" | "signin";
        shape?: "rectangular" | "pill" | "square" | "circle";
        logo_alignment?: "left" | "center";
        width?: number;
        locale?: string;
      },
    ) => void;
    disableAutoSelect: () => void;
    storeCredential: (
      credential: string,
      callback: () => void,
    ) => void;
    cancel: () => void;
    revoke: (hint: string, callback: () => void) => void;
    googleSignIn?: (config: Record<string, unknown>) => void;
  };
  oauth2: GoogleOAuth2;
}

interface Window {
  google?: { accounts: GoogleAccounts };
}