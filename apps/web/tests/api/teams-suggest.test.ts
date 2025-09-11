import fs from 'fs';
import path from 'path';

const API = process.env.TEAMS_API_URL;
const ontologyPath = path.join(process.cwd(), 'config', 'ontology.json');

const skipApi = !API;

(skipApi ? describe.skip : describe)('Team Composition API (roles → competencies)', () => {
  let ontology: any;

  beforeAll(() => {
    const raw = fs.readFileSync(ontologyPath, 'utf-8');
    ontology = JSON.parse(raw);
  });

  it('returns competencies for given roles', async () => {
    const roles = ['frontend_developer', 'backend_developer'];
    const res = await fetch(API as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roles })
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.requiredCompetencies)).toBe(true);

    const competencyIds = new Set(ontology.competencies.map((c: any) => c.id));
    body.requiredCompetencies.forEach((id: string) => {
      expect(competencyIds.has(id)).toBe(true);
    });
  });

  it('returns gap analysis excluding existing competencies', async () => {
    const roles = ['frontend_developer'];
    const existingCompetencies = ['webfrontend_security'];

    const res = await fetch(API as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roles, existingCompetencies })
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    const gaps = (body.competencyGaps || body.gaps) as string[];
    expect(Array.isArray(gaps)).toBe(true);
    expect(gaps.includes('webfrontend_security')).toBe(false);
  });
});
