import * as Yup from 'yup'

export const loginSchema = t => Yup.object({
  username: Yup.string().required(t('requiredField')),
  password: Yup.string().required(t('requiredField')),
})

export const signupSchema = t => Yup.object({
  username: Yup.string()
    .min(3, t('usernameMin'))
    .max(20, t('usernameMax'))
    .required(t('requiredField')),
  password: Yup.string()
    .min(6, t('passwordMin'))
    .required(t('requiredField')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], t('passwordsMustMatch'))
    .required(t('requiredField')),
})

export const channelNameSchema = (t, existingNames = [], currentName = '') => Yup.object({
  name: Yup.string()
    .min(3, t('usernameMin'))
    .max(20, t('usernameMax'))
    .notOneOf(
      existingNames.filter(n => n !== currentName),
      t('channelExists'),
    )
    .required(t('requiredField')),
})
