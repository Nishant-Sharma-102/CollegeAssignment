const statusMap = {
  TO_DO: { label: 'To Do', cls: 'badge-todo' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge-in-progress' },
  REVIEW: { label: 'Review', cls: 'badge-review' },
  DONE: { label: 'Done', cls: 'badge-done' },
};

const priorityMap = {
  LOW: { label: 'Low', cls: 'badge-low' },
  MEDIUM: { label: 'Medium', cls: 'badge-medium' },
  HIGH: { label: 'High', cls: 'badge-high' },
  CRITICAL: { label: 'Critical', cls: 'badge-critical' },
};

const roleMap = {
  ADMIN: { label: 'Admin', cls: 'badge-admin' },
  USER: { label: 'User', cls: 'badge-member' },
};

const projectStatusMap = {
  PLANNING: { label: 'Planning', cls: 'badge-todo' },
  ACTIVE: { label: 'Active', cls: 'badge-in-progress' },
  ON_HOLD: { label: 'On Hold', cls: 'badge-review' },
  COMPLETED: { label: 'Completed', cls: 'badge-done' },
  CANCELLED: { label: 'Cancelled', cls: 'badge-overdue' },
};

export const StatusBadge = ({ status }) => {
  const { label, cls } = statusMap[status] || { label: status, cls: 'badge-todo' };
  return <span className={`badge ${cls}`}>{label}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const { label, cls } = priorityMap[priority] || { label: priority, cls: 'badge-medium' };
  return <span className={`badge ${cls}`}>{label}</span>;
};

export const RoleBadge = ({ role }) => {
  const { label, cls } = roleMap[role] || { label: role, cls: 'badge-member' };
  return <span className={`badge ${cls}`}>{label}</span>;
};

export const ProjectStatusBadge = ({ status }) => {
  const { label, cls } = projectStatusMap[status] || { label: status, cls: 'badge-todo' };
  return <span className={`badge ${cls}`}>{label}</span>;
};
