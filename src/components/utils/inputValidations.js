export const name_validation = {
  name: 'names',
  label: 'name',
  type: 'text',
  id: 'names',
  placeholder: 'write your name ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
    pattern: {
      value:
        /^[а-яА-Яa-zA-Z]+$/,
      message: 'invalid character',
    },
  },
}

export const surname_validation = {
  name: 'surname',
  label: 'surname',
  type: 'text',
  id: 'surname',
  placeholder: 'write your surname ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 30,
      message: '30 characters max',
    },
    pattern: {
      value:
        /^[а-яА-Яa-zA-Z]+$/,
      message: 'invalid character',
    },
  },
}

export const desc_validation = {
  name: 'description',
  label: 'description',
  multiline: true,
  id: 'description',
  placeholder: 'write description ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    maxLength: {
      value: 200,
      message: '200 characters max',
    },
  },
}

export const password_validation = {
  name: 'password_valid',
  label: 'password',
  type: 'password',
  id: 'password',
  placeholder: 'type password ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    minLength: {
      value: 6,
      message: 'min 6 characters',
    },
    pattern: {
      value:
        /^[a-zA-Z0-9]+$/,
      message: 'invalid character',
    },
  },
}
export const repeat_validation = {
  name: 'repeat_password',
  label: 'repeat the password',
  type: 'password',
  id: 'repeat_password',
  placeholder: 'repeate password ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    repeated: {
      value: true,
      message: 'passwords dont match'
    },
    pattern: {
      value:
        /^[a-zA-Z0-9]+$/,
      message: 'invalid character',
    },
  },
}
export const login_password_validation = {
  name: 'login_password',
  label: 'password',
  type: 'password',
  id: 'login_password',
  placeholder: 'type password ...',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    pattern: {
      value:
        /^[a-zA-Z0-9]+$/,
      message: 'invalid character',
    },
  },
}

export const num_validation = {
  name: 'num',
  label: 'phone number',
  type: 'tel',
  id: 'phone_num',
  placeholder: 'write your phone number',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    pattern: {
      value:
        /^\+?[1-9]\d{1,14}$/,
      message: 'incorrect phone number',
    }
  },
}

export const email_validation = {
  name: 'email',
  label: 'email address',
  type: 'email',
  id: 'email',
  placeholder: 'write your email address',
  validation: {
    required: {
      value: true,
      message: 'required',
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'not valid',
    },
  },
}
