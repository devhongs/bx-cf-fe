export type UserType = 'ADMIN' | 'SERVICE';
export type UseYn = 'Y' | 'N';

export interface ManagedUser {
  usrId: string;
  usrNm: string;
  userType: UserType;
  email?: string;
  phoneNo?: string;
  deptName?: string;
  positDivName?: string;
  status?: string;
  useYn?: UseYn;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserQueryParams extends Partial<ManagedUser> {
  page?: number;
  size?: number;
  offset?: number;
  keyword?: string;
  searchType?: string;
  sort?: string;
}

export interface UserListApiRequest {
  pagination?: {
    page?: number;
    size?: number;
    offset?: number;
  };
  filter?: {
    keyword?: string;
    searchType?: string;
    useYn?: string;
  };
  sort?: {
    sort?: string;
  };
  data?: Partial<ManagedUser>;
}

export type UserPayload = Partial<ManagedUser> & Pick<ManagedUser, 'usrId' | 'usrNm' | 'userType'>;
