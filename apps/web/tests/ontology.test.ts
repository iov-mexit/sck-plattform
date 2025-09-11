import fs from 'fs';
import path from 'path';

const ontologyPath = path.join(process.cwd(), 'config', 'ontology.json');

describe('Ontology JSON', () => {
  let ontology: any;

  beforeAll(() => {
    const raw = fs.readFileSync(ontologyPath, 'utf-8');
    ontology = JSON.parse(raw);
  });

  test('has metadata, competencies and roles', () => {
    expect(ontology).toHaveProperty('metadata');
    expect(ontology).toHaveProperty('competencies');
    expect(Array.isArray(ontology.competencies)).toBe(true);
    expect(ontology.competencies.length).toBeGreaterThan(50);
    expect(ontology).toHaveProperty('roles');
    expect(Array.isArray(ontology.roles)).toBe(true);
    expect(ontology.roles.length).toBeGreaterThan(5);
  });

  (process.env.STRICT_ONTOLOGY === 'true' ? test : test.skip)('all roles reference valid competencies', () => {
    const competencyIds = new Set(ontology.competencies.map((c: any) => c.id));
    ontology.roles.forEach((role: any) => {
      expect(Array.isArray(role.requiredCompetencies)).toBe(true);
      role.requiredCompetencies.forEach((id: string) => {
        expect(competencyIds.has(id)).toBe(true);
      });
    });
  });

  test('trustLevels structure is complete', () => {
    ontology.competencies.forEach((c: any) => {
      expect(c).toHaveProperty('trustLevels');
      const levels = Object.keys(c.trustLevels);
      expect(levels).toEqual(['L1', 'L2', 'L3', 'L4', 'L5']);
    });
  });

  test('certifications are arrays of strings', () => {
    ontology.competencies.forEach((c: any) => {
      expect(Array.isArray(c.certifications)).toBe(true);
      c.certifications.forEach((cert: any) => {
        expect(typeof cert).toBe('string');
      });
    });
  });

  test('can aggregate competencies from roles', () => {
    const neededRoles = ['frontend_developer', 'backend_developer'];
    const roleDefs = ontology.roles.filter((r: any) => neededRoles.includes(r.id));
    const skills = new Set(roleDefs.flatMap((r: any) => r.requiredCompetencies));

    expect(skills.has('webfrontend_security')).toBe(true);
    expect(skills.has('api_security')).toBe(true);
    expect(skills.has('injection_attacks')).toBe(true);
  });
});
