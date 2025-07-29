import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RoleTemplate {
  id: string;
  title: string;
  category: string;
  selectable: boolean;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export function RoleAnalytics() {
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoleTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/role-templates');
        if (response.ok) {
          const data = await response.json();
          setRoleTemplates(data.data || []);
        } else {
          throw new Error('Failed to fetch role templates');
        }
      } catch (err) {
        setError('Failed to load role analytics');
        console.error('Role analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleTemplates();
  }, []);

  const getCategoryData = (): CategoryData[] => {
    const categoryCount = roleTemplates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
      '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
    ];

    return Object.entries(categoryCount).map(([category, count], index) => ({
      name: category,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  const categoryData = getCategoryData();
  const totalRoles = roleTemplates.length;
  const selectableRoles = roleTemplates.filter(role => role.selectable).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalRoles}</div>
              <div className="text-sm text-blue-600">Total Roles</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{selectableRoles}</div>
              <div className="text-sm text-green-600">Selectable Roles</div>
            </div>
          </div>

          {/* Category Breakdown */}
          {categoryData.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Role Categories</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">No role templates found</div>
            </div>
          )}

          {/* Category List */}
          {categoryData.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Category Breakdown</h4>
              <div className="space-y-2">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-gray-600">{category.value} roles</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 