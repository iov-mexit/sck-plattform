#!/usr/bin/env ts-node

import { readdirSync, statSync, existsSync, unlinkSync } from 'fs';
import { join, extname } from 'path';

interface DuplicateGroup {
  base: string;
  files: string[];
  hasTs: boolean;
  hasJs: boolean;
  hasJsx: boolean;
  hasTsx: boolean;
}

function walkDir(dir: string, filelist: string[] = []): string[] {
  if (!existsSync(dir)) return filelist;

  try {
    for (const file of readdirSync(dir)) {
      const fullPath = join(dir, file);
      if (statSync(fullPath).isDirectory()) {
        // Skip node_modules, .next, .git, etc.
        if (!file.startsWith('.') && file !== 'node_modules') {
          filelist = walkDir(fullPath, filelist);
        }
      } else {
        filelist.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  return filelist;
}

function findJsTsDuplicates(files: string[]): DuplicateGroup[] {
  const baseMap: Record<string, string[]> = {};

  for (const file of files) {
    const ext = extname(file);
    if (!['.ts', '.js', '.tsx', '.jsx'].includes(ext)) continue;

    const base = file.replace(ext, '');
    if (!baseMap[base]) baseMap[base] = [];
    baseMap[base].push(file);
  }

  return Object.entries(baseMap)
    .filter(([_, group]) => {
      const hasTs = group.some(f => f.endsWith('.ts'));
      const hasJs = group.some(f => f.endsWith('.js'));
      const hasTsx = group.some(f => f.endsWith('.tsx'));
      const hasJsx = group.some(f => f.endsWith('.jsx'));
      return (hasTs && hasJs) || (hasTsx && hasJsx);
    })
    .map(([base, files]) => ({
      base,
      files,
      hasTs: files.some(f => f.endsWith('.ts')),
      hasJs: files.some(f => f.endsWith('.js')),
      hasTsx: files.some(f => f.endsWith('.tsx')),
      hasJsx: files.some(f => f.endsWith('.jsx'))
    }));
}

function autoDeleteJsDuplicates(duplicates: DuplicateGroup[]) {
  let deleted: string[] = [];
  for (const group of duplicates) {
    if (group.hasTs && group.hasJs) {
      for (const file of group.files) {
        if (file.endsWith('.js')) {
          try {
            unlinkSync(file);
            deleted.push(file);
          } catch (e) {
            console.error(`Failed to delete ${file}:`, e);
          }
        }
      }
    }
    if (group.hasTsx && group.hasJsx) {
      for (const file of group.files) {
        if (file.endsWith('.jsx')) {
          try {
            unlinkSync(file);
            deleted.push(file);
          } catch (e) {
            console.error(`Failed to delete ${file}:`, e);
          }
        }
      }
    }
  }
  return deleted;
}

function main() {
  console.log('🔍 Scanning for duplicate .ts/.js files...\n');

  const allFiles = walkDir('./');
  const duplicates = findJsTsDuplicates(allFiles);

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found! Your project is clean.');
    return;
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate file groups:\n`);

  duplicates.forEach((group, index) => {
    console.log(`${index + 1}. ${group.base}`);
    group.files.forEach(file => {
      const relativePath = file.replace(process.cwd() + '/', '');
      console.log(`   📄 ${relativePath}`);
    });
    if (group.hasTs && group.hasJs) {
      console.log(`   💡 Recommendation: Keep .ts, remove .js`);
    }
    if (group.hasTsx && group.hasJsx) {
      console.log(`   💡 Recommendation: Keep .tsx, remove .jsx`);
    }
    console.log('');
  });

  // Auto-delete .js/.jsx files if .ts/.tsx exists
  const deleted = autoDeleteJsDuplicates(duplicates);
  if (deleted.length > 0) {
    console.log('🗑️  Deleted the following files:');
    deleted.forEach(f => console.log(`   - ${f}`));
  } else {
    console.log('No files deleted.');
  }

  console.log('\n💡 Next steps:');
  console.log('   1. Review the output above');
  console.log('   2. Only TypeScript files (.ts/.tsx) remain');
  console.log('   3. Run this script again to verify cleanup');
}

main(); 