# 작업 로그

## 문서 목적
이 문서는 프로젝트 작업 흐름에서 중요한 결정이나 맥락 변화를 짧게 기록하기 위한 로그입니다.

자세한 구현 계획은 `docs/roadmap.md`에 남기고, 이 문서는 시간순 기록만 간단히 유지합니다.

## 로그
- 2026-05-29: 활성 실험을 `community_interest_feed_preview`로 전환했다. variant는 `zero_line_content`, `ai_summary`, `full_content`로 두고, 최초 관심사 선택 이후 선택 관심사 글을 먼저 보여준다.
- 2026-05-28: 활성 실험을 다시 `community_post_list_preview`로 전환했다. variant는 `one_line_content`, `two_line_content`, `ai_summary`, `full_content`로 둔다.
- 2026-05-27: 커뮤니티 글 목록 preview 실험을 보류하고, 새 활성 실험을 `community_interest_topic_recommendation`으로 전환했다. variant는 `control`, `interest_based`로 둔다.
- 2026-05-26: `/` 기본 진입을 `/community`로 변경하고, 커뮤니티 글 목록을 80개 단위 자동 infinite load로 바꿨다. 실험 variant는 익명 `session_id` 해시 기반으로 안정 배정한다.
- 2026-05-26: 커뮤니티 글 목록 preview 실험을 시작했다. 활성 실험 속성은 `community_post_list_preview`, iteration `1`, variant는 `one_line_content`, `two_line_content`, `ai_summary`, `full_content`로 둔다.
- 2026-05-20: 커뮤니티 탭에 글쓰기 FAB와 유형 선택 바텀시트를 추가했다.
- 2026-05-20: 앱 버전을 5.0으로 올리고 활성 실험 속성을 none으로 초기화했다.
