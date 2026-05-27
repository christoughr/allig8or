# Bing Webmaster — 2분 설정 (한 번만)

코드 쪽은 **IndexNow** + 사이트맵으로 준비됨. Bing 대시보드만 연결하면 됩니다.

## 가장 빠른 방법 (추천)

1. https://www.bing.com/webmasters  
2. **Add a site** → `https://www.allig8tor.com`  
3. **Import from Google Search Console** 클릭  
4. 구글 계정 연결 → 가져오기 완료  

끝. 사이트맵은 구글과 같이 `https://www.allig8tor.com/sitemap.xml` 사용.

## HTML 태그로 확인하는 방법 (대안)

1. Bing에서 **HTML Meta Tag** 선택 → `content="..."` 코드 복사  
2. Vercel env: `NEXT_PUBLIC_BING_SITE_VERIFICATION` = 그 코드  
3. Redeploy  
4. Bing에서 **Verify**

## 배포 후 자동 알림 (IndexNow)

배포 후 이 URL이 Bing 등에 URL 제출함:

`https://www.allig8tor.com/api/indexnow`

확인 키 파일: `https://www.allig8tor.com/allig8torindexnow2026.txt`
