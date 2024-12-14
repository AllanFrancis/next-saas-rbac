import { defineAbilityFor, projectSchema } from '@saas/auth';

const ability = defineAbilityFor({
  id: 'user-id',
  role: 'MEMBER',
});

const project = projectSchema.parse({ id: 'project-id', ownerId: 'user2-id' });

console.log(ability.can('delete', project));
