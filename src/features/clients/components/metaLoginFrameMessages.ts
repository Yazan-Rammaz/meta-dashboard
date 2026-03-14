import { MetaAuthResponse } from '@/models/metaAuth';

export const META_LOGIN_FRAME_SOURCE = 'meta-login-frame';

export type MetaLoginFrameMessage =
    | {
          source: typeof META_LOGIN_FRAME_SOURCE;
          type: 'success';
          payload: MetaAuthResponse;
      }
    | {
          source: typeof META_LOGIN_FRAME_SOURCE;
          type: 'error';
          message: string;
      };
