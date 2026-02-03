# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - navigation [ref=e4]:
      - list [ref=e5]:
        - listitem [ref=e6]:
          - link "Cases" [ref=e7] [cursor=pointer]:
            - /url: /cases
        - listitem [ref=e8]:
          - link "Settings" [ref=e9] [cursor=pointer]:
            - /url: /settings
    - generic [ref=e10]:
      - banner [ref=e11]:
        - generic [ref=e12]: "Environment: Local"
        - generic [ref=e13]: "Role: Clinician"
        - button "Logout" [ref=e14]
      - generic [ref=e16]:
        - text: Username
        - textbox "Username" [ref=e17]
        - text: Password
        - textbox "Password" [ref=e18]
        - button "Login" [ref=e19]
  - alert [ref=e20]
```