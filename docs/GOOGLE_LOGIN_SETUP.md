# Google 로그인 설정

## 앱 구현

- 시작 화면과 로그인 창의 `Google로 계속하기`는 Supabase `signInWithOAuth`를 호출합니다.
- 복귀 주소는 현재 앱 origin + Vite BASE_URL입니다. Supabase가 세션을 복원합니다.
- Google 계정은 기존 `gs_new_member` 트리거로 프로필이 생성됩니다.
- 프로필의 닉네임과 참여 유형별 필수 정보가 없으면 가입 폼을 표시합니다.
- 학생은 학교/단과대학/학과/학번, 시민은 닉네임과 참여 유형을 입력합니다.
- `gs_update_profile` RPC로 본인 프로필에 저장합니다. 추가 테이블이나 프런트엔드 비밀키는 필요 없습니다.
- 입력을 마치기 전에 닫으면 로그아웃합니다. 다음 로그인에서 입력 절차를 이어갑니다.

## Google Cloud에서 직접 할 일

1. https://console.cloud.google.com/auth/overview 에서 프로젝트를 선택하거나 생성합니다.
2. Google Auth Platform의 Branding에 앱 이름 `GreenStep`, 지원/개발자 이메일을 입력합니다.
3. Audience는 일반 Google 계정 사용자가 가입할 수 있도록 External을 선택합니다.
   Testing 상태로 사용한다면 로그인할 Google 계정을 Test users에 추가합니다.
4. Data Access는 `openid`, `userinfo.email`, `userinfo.profile`만 사용합니다.
5. Clients → Create client → Web application을 선택합니다.
6. Authorized JavaScript origins:

   ```text
   https://greenstep-iota.vercel.app
   ```

7. Authorized redirect URIs:

   ```text
   https://dfgdtvgpnsyjhnsttibs.supabase.co/auth/v1/callback
   ```

8. 발급한 Client ID와 Client Secret을 Supabase → Authentication → Sign In / Providers → Google에 직접 입력하고 활성화 후 저장합니다.
   Secret은 `.env.example`, `VITE_*`, GitHub, 채팅에 넣지 않습니다.
9. 전체 사용자에게 공개할 때 Audience의 게시 상태 및 Google의 요구사항을 확인합니다.

## Supabase URL 설정

Site URL 및 Redirect URLs에 `https://greenstep-iota.vercel.app/`를 등록합니다.
다른 배포 주소나 로컬 개발 주소를 사용하면 실제 origin과 경로를 추가해야 합니다.
이메일/비밀번호 즉시 가입은 Sign In / Providers의 Confirm email을 꺼야 합니다.
기존 미인증 계정의 처리 여부는 별도로 확인하며, 이 변경은 기존 계정 데이터를 삭제하지 않습니다.

## 상태

2026-10-18 기준:

- Google 로그인 및 프로필 입력 코드가 PR #3으로 main에 병합되었고 Vercel 운영 배포가 완료되었습니다.
- Supabase에 사용자가 Google OAuth 자격 증명을 등록했고, Google 제공자를 활성화했습니다.
- Confirm email은 꺼져 있으며, Site URL과 Redirect URLs는 `https://greenstep-iota.vercel.app/`로 설정했습니다.
- 배포 앱에서 Google 계정 선택 화면으로 정상 이동하는 것을 확인했습니다.
- 계정 선택 이후 로그인 완료 및 프로필 저장까지의 실제 사용자 확인은 아직 남아 있습니다.
- OAuth Secret은 Supabase에만 저장하며 저장소에는 포함하지 않습니다. 대시보드 설정은 GitHub 코드와 별도로 관리됩니다.

공식 안내: https://supabase.com/docs/guides/auth/social-login/auth-google
