import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const cache=new Map();
function load(file) {
  file=path.resolve(file);
  if(cache.has(file)) return cache.get(file);
  const module={exports:{}};cache.set(file,module.exports);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{})(p=>load(path.resolve(path.dirname(file),p+'.ts')),module,module.exports);
  return module.exports;
}
const {INITIAL_CHALLENGES}=load('src/mock/initialData.ts');
const {getChallengeRewardPoints}=load('src/lib/challengeRewards.ts');
const quote=s=>s==null?'NULL':"'"+String(s).replaceAll("'","''")+"'";
const values=INITIAL_CHALLENGES.map(c=>`(${quote(c.id)},${quote(c.title)},${getChallengeRewardPoints(c)},${quote(c.officialIncentiveId)},${!!c.active})`).join(',\n');
fs.writeFileSync('supabase/migrations/202610160003_challenge_seed.sql',`-- Generated from canonical challenge reward rules. App points are not official cash payouts.\nINSERT INTO public.gs_challenges(id,title,points,incentive_id,active) VALUES\n${values}\nON CONFLICT(id) DO UPDATE SET title=excluded.title,points=excluded.points,incentive_id=excluded.incentive_id,active=excluded.active;\n`);
console.log(`Prepared ${INITIAL_CHALLENGES.length} challenge definitions`);
