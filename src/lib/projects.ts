import { getCollection } from 'astro:content';
import { url } from './url';

// 카드는 me/records/projects.md 한 줄씩. 상세 본문은 같은 slug의 kind: project 노트 (없으면 카드 정보만)
// slug 규칙은 scripts/publish.mjs의 projectSlug와 같게 둔다
export const projectSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function getProjects() {
  const records = (await getCollection('projects')).sort((x, y) => x.id.localeCompare(y.id));
  const notes = await getCollection('writing', (e) => e.data.kind === 'project');
  return records.map(({ data }) => {
    // 'MoonLiver: 3D Surgical Planning Solution' → 제목 MoonLiver, 소제목 뒤쪽
    const [title, ...rest] = data.text.split(': ');
    const slug = projectSlug(title);
    return {
      title,
      subtitle: rest.join(': '),
      period: data.period,
      slug,
      href: url(`/projects/${slug}/`),
      note: notes.find((n) => n.id === slug),
    };
  });
}
