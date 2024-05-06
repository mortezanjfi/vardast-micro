export interface User {
  login: {
    accessToken: string
    user: {
      id: string
      uuid: string
      firstName: string
      lastName: string
      email: string
      cellphone: string
      telegramChatId: string
      isCellphoneVerified: string
      isEmailVerified: string
      isTelegramVerified: string
      username: string
      mustChangePassword: string
      lastPasswordChangeAt: string
      language: string
      timezone: string
      country: {
        id: string
        name: string
        nameEn: string
        slug: string
      }
      status: string
      suspensionReason: string
      customDisplayRole: string
      adminComments: string
      lastLoginAt: string
      lastLoginIP: string
      lastFailedLoginAt: string
      failedLoginAttempts: string
      isLockedOut: string
      lockedOutAt: string
      // createdAt: string
      // updatedAt: string
      fullName: string
    }
  }
}
