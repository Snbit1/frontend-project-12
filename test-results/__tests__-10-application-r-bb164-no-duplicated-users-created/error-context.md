# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - generic [ref=e4]:
      - link "Hexlet Chat" [ref=e5] [cursor=pointer]:
        - /url: /
      - generic [ref=e6]:
        - link "Войти" [ref=e7] [cursor=pointer]:
          - /url: /login
        - link "Регистрация" [ref=e8] [cursor=pointer]:
          - /url: /signup
  - generic [ref=e14]:
    - heading "Регистрация" [level=2] [ref=e15]
    - alert [ref=e16]: Такой пользователь уже существует
    - generic [ref=e17]:
      - generic [ref=e18]:
        - textbox "Имя пользователя" [ref=e19]: user2
        - generic: Имя пользователя
      - generic [ref=e20]:
        - textbox "Пароль" [ref=e21]: password
        - generic: Пароль
      - generic [ref=e22]:
        - textbox "Подтвердите пароль" [ref=e23]: password
        - generic: Подтвердите пароль
      - button "Зарегистрироваться" [ref=e24] [cursor=pointer]
  - region "Notifications Alt+T"
```