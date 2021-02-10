import {User} from '../../shared/user';

export interface Message{
  message: string;
  user: User;
  timestamp: Date;
  isSystemInfo: boolean;
}
