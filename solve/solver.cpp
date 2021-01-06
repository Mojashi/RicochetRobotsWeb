#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <cstdio>
#include <vector>
#include <cmath>
#include <cstring>
#include <numeric>
#include <algorithm>
#include <functional>
#include <array>
#include <map>
#include <queue>
#include <time.h>
#include <limits.h>
#include <set>
#include <stack>
#include <random>
#include <complex>
#include <unordered_map>
#include <unordered_set>
#define rep(i,s,n) for(int i = (s); (n) > i; i++)
#define REP(i,n) rep(i,0,n)
#define RANGE(x,a,b) (min(a,b) <= (x) && (x) <= max(a,b)) //hei
#define DUPLE(a,b,c,d) (RANGE(a,c,d) || RANGE(b,c,d) || RANGE(c,a,b) || RANGE(d,a,b))
#define INCLU(a,b,c,d) (RANGE(a,c,d) && (b,c,d))
#define PW(x) ((x)*(x))
#define ALL(x) (x).begin(), (x).end()
#define RALL(x) (x).rbegin(), (x).rend()
#define MODU 1000000007LL
#define bitcheck(a,b)   ((a >> b) & 1)
#define bitset(a,b)      ( a |= (1 << b))
#define bitunset(a,b)    (a &= ~(1 << b))
#define MP(a,b) make_pair((a),(b))
#define Manh(a,b) (abs((a).first-(b).first) + abs((a).second - ((b).second))
#define pritnf printf
#define scnaf scanf
#define itn int
#define PI 3.141592653589

#include <cassert>

#define izryt bool
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
template<typename A, size_t N, typename T>
void Fill(A(&array)[N], const T &val) {
	std::fill((T*)array, (T*)(array + N), val);
}
pll Dir[4] = {
	{ -1 ,0 },{ 0 , 1 },{ 1 ,0 },{ 0 ,-1 }
};

//[a, b)
#define Getsum(ar, a,b) (ar[b] - ar[a])
#define INF 10000000000000000LL
#define chmax(a,b) a = max(a,b)
#define chmin(a,b) a = min(a,b)

#ifndef _MSC_VER
#define _ASSERTE assert
#endif


struct Edge {
	int from, to;
	ll w;
	bool operator<(const Edge& rhs) const {
		return MP(w, MP(from, to)) < MP(rhs.w, MP(rhs.from, rhs.to));
	}
};

typedef vector<set<Edge>> Graph;

enum {
	UP,
	RIGHT,
	DOWN,
	LEFT
};
#define OPP(x) ((x + 2) % 4)
enum {
	BLUE,
	RED,
	GREEN,
	YELLOW,
	BLACK,
	MIX,
	NOCOLOR
};
enum {
	GEAR,
	MOON,
	SATURN,
	STAR,
	NOMARK
};
const string colorname[] = { "Blue","Red", "Green", "Yellow", "Black", "Mix" },
markname[] = { "Gear","Moon", "Saturn", "Star" };

struct Tile {
	bool wall[4] = {}, marked = false;
	int color = NOCOLOR, mark = NOMARK;
};
int count32bit(unsigned v) {
	unsigned count = (v & 0x55555555) + ((v >> 1) & 0x55555555);
	count = (count & 0x33333333) + ((count >> 2) & 0x33333333);
	count = (count & 0x0f0f0f0f) + ((count >> 4) & 0x0f0f0f0f);
	count = (count & 0x00ff00ff) + ((count >> 8) & 0x00ff00ff);
	return (count & 0x0000ffff) + ((count >> 16) & 0x0000ffff);
}
inline int MSB32bit(unsigned v) {
	if (v == 0) return 0;
	v |= (v >> 1);
	v |= (v >> 2);
	v |= (v >> 4);
	v |= (v >> 8);
	v |= (v >> 16);
	return count32bit(v) - 1;
}
inline int LSB32bit(unsigned v) {
	if (v == 0) return 0;
	v |= (v << 1);
	v |= (v << 2);
	v |= (v << 4);
	v |= (v << 8);
	v |= (v << 16);
	return 32 - count32bit(v);
}

int statecou = 0;
struct Board {
	static const int Width = 16, Height = 16;
	Tile field[Height][Width];
	unsigned int vwalls[Width] = {}, hwalls[Height] = {};
	unsigned int mask[2][17] = {}, MSB[1 << 17], LSB[1 << 17];
	bool nxw[Height][Width] = {};
#define PNUM(a) (a.first * Width + a.second)
#define PtoD(x) ((x.first + 3*x.first + x.second + 4*x.second)%4)
public:

	void Scan() {

		REP(i, 17) {
			rep(j, i, 17)
				bitset(mask[0][i], j);
			REP(j, i)
				bitset(mask[1][i], j);
		}
		REP(i, 1 << 17) {
			MSB[i] = MSB32bit(i);
			LSB[i] = LSB32bit(i);
		}

		/*
		cout << "input mark position." << endl;
		REP(i, 4) {
			REP(j, 4) {
				pii pos;
				printf("%s-%s : ", colorname[i].c_str(), markname[j].c_str());
				scanf("%d %d", &pos.first, &pos.second);

				field[pos.first][pos.second].marked = true;
				field[pos.first][pos.second].color = i;
				field[pos.first][pos.second].mark = j;
			}
		}*/

		//cout << "input wall position. UP:0 RIGHT:1 DOWN 2: LEFT: 3" << endl;

		while (1) {
			pii f;
			int dir;
			scanf("%d %d %d", &f.first, &f.second, &dir);
			if (f.first == -1) break;

			field[f.first][f.second].wall[dir] = true;
			if(field[f.first + Dir[dir].first>=0&&f.second + Dir[dir].second]>=0&& f.first + Dir[dir].first<16&&f.second + Dir[dir].second<16)
				field[f.first + Dir[dir].first][f.second + Dir[dir].second].wall[(dir + 2) % 4] = true;
		}

		REP(i, Width) {
			field[0][i].wall[UP] = true;
			field[Width - 1][i].wall[DOWN] = true;
		}
		REP(i, Height) {
			field[i][0].wall[LEFT] = true;
			field[i][Height - 1].wall[RIGHT] = true;
		}
		field[7][6].wall[RIGHT] = true;
		field[8][6].wall[RIGHT] = true;
		field[7][9].wall[LEFT] = true;
		field[8][9].wall[LEFT] = true;
		field[6][7].wall[DOWN] = true;
		field[6][8].wall[DOWN] = true;
		field[9][7].wall[UP] = true;
		field[9][8].wall[UP] = true;
		field[7][7].wall[LEFT] = true;
		field[7][7].wall[UP] = true;
		field[7][8].wall[UP] = true;
		field[7][8].wall[RIGHT] = true;
		field[8][8].wall[DOWN] = true;
		field[8][8].wall[RIGHT] = true;
		field[8][7].wall[DOWN] = true;
		field[8][7].wall[LEFT] = true;

		REP(i, Height) {
			REP(j, Width) {
				if (field[i][j].wall[UP])
					bitset(vwalls[j], i);
				if (field[i][j].wall[DOWN])
					bitset(vwalls[j], i + 1);
				if (field[i][j].wall[LEFT])
					bitset(hwalls[i], j);
				if (field[i][j].wall[RIGHT])
					bitset(hwalls[i], j + 1);
			}
		}

		REP(i, Height) {
			REP(j, Width) {
				REP(k, 4) {
					nxw[i][j] |= field[i][j].wall[k];
				}
			}
		}
	}

	inline ll Encode(vector<pii> robots, int idx) {
		ll ret = 0;
		swap(robots[idx], robots[0]);
		sort(robots.begin() + 1, robots.end());
		REP(i, robots.size()) {
			ll cur = PNUM(robots[i]);
			ret |= cur << i * 8;
		}
		return ret;
	}

	pii Go(vector<pii>& robots, int idx, int dir) {
		pii ret, pos = robots[idx];
		switch (dir) {
		case UP:
			ret.first = MSB[vwalls[pos.second] & mask[1][pos.first + 1]];
			ret.second = pos.second;
			break;
		case RIGHT:
			ret.first = pos.first;
			ret.second = LSB[hwalls[pos.first] & mask[0][pos.second + 1]] - 1;
			break;
		case LEFT:
			ret.first = pos.first;
			ret.second = MSB[hwalls[pos.first] & mask[1][pos.second + 1]];
			break;
		case DOWN:
			ret.first = LSB[vwalls[pos.second] & mask[0][pos.first + 1]] - 1;
			ret.second = pos.second;
			break;
		}

		REP(i, robots.size()) {
			if (i == idx) continue;
			if ((dir == UP || dir == DOWN) && robots[i].second == pos.second && RANGE(robots[i].first, ret.first, pos.first)) {
				ret.first = robots[i].first - Dir[dir].first;
				ret.second = robots[i].second;
			}
			else if ((dir == LEFT || dir == RIGHT) && robots[i].first == pos.first && RANGE(robots[i].second, ret.second, pos.second)) {
				ret.first = robots[i].first;
				ret.second = robots[i].second - Dir[dir].second;
			}
		}

		return ret;
	}

	template<typename T>
	struct Node {
		T v;
		int root;
		vector<Node*> nx;
		Node* p = NULL;
		Node(int rt) : root(rt) {}
		Node(Node* par) :p(par) { if (par != NULL) root = par->root; }
		Node(Node* par, T in) : p(par), v(in) { if (par != NULL) root = par->root; }
	};

	int dist[256][256] = {}, distdir[256][256][4] = {};
	vector<Node<pii>*> block[256][256];

	void Calcdist() {
		Fill(dist, -1);
		REP(st, 256) {
			queue<pair<Node<pii>*, pii>> que;
			que.push({ new Node<pii>(st), { 0,st} });

			while (que.size()) {
				auto cur = que.front();
				que.pop();

				if (dist[st][cur.second.second] == -1 || dist[st][cur.second.second] == cur.second.first)
					block[st][cur.second.second].push_back(cur.first);
				if (dist[st][cur.second.second] != -1)	continue;

				dist[st][cur.second.second] = cur.second.first;
				REP(i, 4) {
					pii pos = { cur.second.second / Width, cur.second.second % Width };
					while (field[pos.first][pos.second].wall[i] == false) {
						pos = MP(pos.first + Dir[i].first, pos.second + Dir[i].second);
						int nex = PNUM(pos);
						//if (dist[st][nex] == -1) {
						Node<pii>* nxn = cur.first;
						if ((field[pos.first][pos.second].wall[i] == false)) {
							cur.first->nx.push_back(nxn = new Node<pii>(cur.first, MP(pos.first + Dir[i].first, pos.second + Dir[i].second)));
						}
						que.push({ nxn,{ cur.second.first + 1, nex } });
						//}
					}
				}
			}
		}
		Fill(distdir, INT_MAX / 10);
		REP(i, 256) {
			REP(j, 256) {
				REP(k, 4) {
					pii fr = { j / Width + Dir[k].first, j%Width + Dir[k].second };
					if (fr.first >= 0 && fr.second >= 0 && fr.first < Height && fr.second < Width)
						distdir[i][j][k] = 1 + dist[i][PNUM(fr)];
				}
			}
		}

	}

	inline int Greedy(vector<pii>& robots, int idx, pii to) {
		int frp = PNUM(robots[idx]), top = PNUM(to);
		for (auto itr : block[frp][top]) {
			if (itr->root == frp) {
				Node<pii>* cur = itr;
				while (cur->p != NULL) {
					bool ok = false;
					REP(i, robots.size()) {
						if (robots[i] == cur->v) {
							ok = true;
							break;
						}
					}
					if (ok == false) return INT_MAX / 2;
					cur = cur->p;
				}
			}
		}

		return dist[frp][top];
	}
	bool nxr[Height + 2][Width + 2] = {};
	inline int Estimate(vector<pii>& robots, int idx, pii to, int level) {
		int frp = PNUM(robots[idx]), top = PNUM(to);
		if (level == -1) {
			return (to.first != robots[idx].first) + (to.second != robots[idx].second);
		}
		if (level == 0) {
			return dist[frp][top];
		}
		else if (level == 1) {
			if (nxw[to.first][to.second]) return dist[frp][top];

			for (auto itr : robots) {
				REP(i, 4) {
					nxr[itr.first + Dir[i].first + 1][itr.second + Dir[i].second + 1] = 1;
				}
			}
			if (nxr[to.first + 1][to.second + 1]) {
				for (auto itr : robots) {
					REP(i, 4) {
						nxr[itr.first + Dir[i].first + 1][itr.second + Dir[i].second + 1] = 0;
					}
				}
				return dist[frp][top];
			}

			int penalty = INT_MAX;
			REP(i, 4) {

				pii nex = { to.first + Dir[i].first, to.second + Dir[i].second };

				int Mindist = INT_MAX;
				REP(j, robots.size()) {
					if (j == idx) continue;
					chmin(Mindist, dist[PNUM(robots[j])][PNUM(nex)] + 1 - (nxw[nex.first][nex.second] | nxr[nex.first + 1][nex.second + 1]));
				}
				chmin(penalty, Mindist);

			}

			for (auto itr : robots) {
				REP(i, 4) {
					nxr[itr.first + Dir[i].first + 1][itr.second + Dir[i].second + 1] = 0;
				}
			}
			return dist[frp][top] + penalty;
		}
		else if (level == 2) {
			if (nxw[to.first][to.second]) return dist[frp][top];

			for (auto itr : robots) {
				REP(i, 4) {
					nxr[itr.first + Dir[i].first + 1][itr.second + Dir[i].second + 1] = 1;
				}
			}
			if (nxr[to.first + 1][to.second + 1]) {
				for (auto itr : robots) {
					REP(i, 4) {
						nxr[itr.first + Dir[i].first + 1][itr.second + Dir[i].second + 1] = 0;
					}
				}
				return dist[frp][top];
			}

			int ret = INT_MAX;
			REP(i, 4) {
				int Mindist[5] = { INT_MAX / 3,INT_MAX / 3,INT_MAX / 3,INT_MAX / 3 ,INT_MAX / 3 };
				pii nex = { to.first + Dir[i].first, to.second + Dir[i].second };
				REP(j, robots.size()) {
					if (j == idx) continue;
					chmin(Mindist[0], (j == 0) *INT_MAX / 4 + dist[PNUM(robots[j])][PNUM(nex)]);
					chmin(Mindist[1], (j == 1) *INT_MAX / 4 + dist[PNUM(robots[j])][PNUM(nex)]);
					chmin(Mindist[2], (j == 2) *INT_MAX / 4 + dist[PNUM(robots[j])][PNUM(nex)]);
					chmin(Mindist[3], (j == 3) *INT_MAX / 4 + dist[PNUM(robots[j])][PNUM(nex)]);
					chmin(Mindist[4], (j == 4) *INT_MAX / 4 + dist[PNUM(robots[j])][PNUM(nex)]);
				}
				if ((nxw[nex.first][nex.second] | nxr[nex.first + 1][nex.second + 1]) == false) {
					REP(j, 4) {
						if (OPP(j) == i) continue;
						//int Mindist2 = INT_MAX / 3;
						pii nexx = { nex.first + Dir[j].first, nex.second + Dir[j].second };

						REP(k, robots.size()) {
							if (k == idx) continue;
							int dist2 = dist[PNUM(robots[k])][PNUM(nexx)] + 1 - (nxw[nexx.first][nexx.second] | nxr[nexx.first + 1][nexx.second + 1]);
							//chmin(Mindist2, dist2);
							chmin(ret, Mindist[k] + dist2 + dist[frp][top]);
						}
						chmin(ret, Mindist[idx] + 2 + (i == j) + dist[frp][PNUM(nexx)] + 1 - (nxw[nexx.first][nexx.second] | nxr[nexx.first + 1][nexx.second + 1]));
					}
				}
				else {
					chmin(ret, Mindist[idx] + dist[frp][top]);
				}
			}


			for (auto itr : robots) {
				REP(i, 4) {
					nxr[itr.first + Dir[i].first + 1][itr.second + Dir[i].second + 1] = 0;
				}
			}
			if (ret == INT_MAX) cout << "E" << endl;
			return ret;
		}
		else if (level == 3) {
			if (nxw[to.first][to.second]) return dist[frp][top];

			for (auto itr : robots) {
				REP(i, 4) {
					nxr[itr.first + Dir[i].first + 1][itr.second + Dir[i].second + 1] = 1;
				}
			}
			if (nxr[to.first + 1][to.second + 1]) {
				for (auto itr : robots) {
					REP(i, 4) {
						nxr[itr.first + Dir[i].first + 1][itr.second + Dir[i].second + 1] = 0;
					}
				}
				return dist[frp][top];
			}

			pii secp[9] = { to, {to.first + 2, to.second + 0} , {to.first + 1, to.second + 1} , {to.first + 0, to.second + 2} , {to.first - 1, to.second + 1} ,
			 {to.first + 0, to.second - 2} ,  {to.first + 1, to.second - 1} ,  {to.first + 0, to.second - 2} ,  {to.first - 1, to.second - 1} };

			int ret = INT_MAX;

			REP(i, 9) {
				int isnxw = 1 - (nxw[secp[i].first][secp[i].second] | nxr[secp[i].first + 1][secp[i].second + 1]);
				int Mindist2[5] = { INT_MAX,INT_MAX,INT_MAX,INT_MAX,INT_MAX };
				pii sa = { secp[i].first - to.first, secp[i].second - to.second };
				REP(j, robots.size()) {
					// (j == idx) * (2 + ((secp[i].first - to.first) == 2 || (secp[i].second - to.second) == 2)) + 
					if (j == idx) continue;
					int dis = dist[PNUM(robots[j])][PNUM(secp[i])] + isnxw * (1 - (secp[i] == robots[j]));
					chmin(Mindist2[0], (j == 0) * INT_MAX / 2 + dis);
					chmin(Mindist2[1], (j == 1) * INT_MAX / 2 + dis);
					chmin(Mindist2[2], (j == 2) * INT_MAX / 2 + dis);
					chmin(Mindist2[3], (j == 3) * INT_MAX / 2 + dis);
					chmin(Mindist2[4], (j == 4) * INT_MAX / 2 + dis);
				}
				if (secp[i] == to) {
					REP(j, 4) {
						int opd = OPP(j);
						REP(k, robots.size()) {
							if (k == idx) continue;
							chmin(ret, 1 + distdir[frp][top][opd] + Mindist2[k] + distdir[PNUM(robots[k])][PNUM(MP(to.first + Dir[j].first, to.second + Dir[j].second))][j]);
						}
					}
				}
				else {

					if (secp[i].first > to.first) {
						int opd = OPP(PtoD(MP(sa.first - 1, sa.second))), poid = 2 + (secp[i].first - to.first == 2);
						REP(j, robots.size()) {
							if (j == idx) continue;
							chmin(ret, distdir[frp][top][opd] + Mindist2[j] + distdir[PNUM(robots[j])][PNUM(secp[i]) - Width][0]);
							chmin(ret, poid + distdir[frp][top][opd] + dist[PNUM(robots[idx])][PNUM(secp[i])] + isnxw + distdir[PNUM(robots[j])][PNUM(secp[i]) - Width][0]);
						}
					}
					else if (secp[i].first < to.first) {
						int opd = OPP(PtoD(MP(sa.first + 1, sa.second))), poid = 2 + (to.first - secp[i].first == 2);
						REP(j, robots.size()) {
							if (j == idx) continue;
							chmin(ret, distdir[frp][top][opd] + Mindist2[j] + distdir[PNUM(robots[j])][PNUM(secp[i]) + Width][2]);
							chmin(ret, poid + distdir[frp][top][opd] + dist[PNUM(robots[idx])][PNUM(secp[i])] + isnxw + distdir[PNUM(robots[j])][PNUM(secp[i]) + Width][2]);
						}
					}
					if (secp[i].second > to.second) {
						int opd = OPP(PtoD(MP(sa.first, sa.second - 1))), poid = 2 + (secp[i].second - to.second == 2);
						REP(j, robots.size()) {
							if (j == idx) continue;
							chmin(ret, distdir[frp][top][opd] + Mindist2[j] + distdir[PNUM(robots[j])][PNUM(secp[i]) - 1][3]);
							chmin(ret, poid + distdir[frp][top][opd] + dist[PNUM(robots[idx])][PNUM(secp[i])] + isnxw + distdir[PNUM(robots[j])][PNUM(secp[i]) - 1][3]);
						}
					}
					else if (secp[i].second < to.second) {
						int opd = OPP(PtoD(MP(sa.first, sa.second + 1))), poid = 2 + (to.second - secp[i].second == 2);
						REP(j, robots.size()) {
							if (j == idx) continue;
							chmin(ret, distdir[frp][top][opd] + Mindist2[j] + distdir[PNUM(robots[j])][PNUM(secp[i]) + 1][1]);
							chmin(ret, poid + distdir[frp][top][opd] + dist[PNUM(robots[idx])][PNUM(secp[i])] + isnxw + distdir[PNUM(robots[j])][PNUM(secp[i]) + 1][1]);
						}
					}
				}
			}
			for (auto itr : robots) {
				REP(i, 4) {
					nxr[itr.first + Dir[i].first + 1][itr.second + Dir[i].second + 1] = 0;
				}
			}
			if (ret == INT_MAX) cout << "E" << endl;
			return ret;
		}
		else if (level == 4) {
			int penalty = INT_MAX;
			for (auto itr : block[frp][top]) {
				if (itr->root == frp) {
					Node<pii>* cur = itr;
					int curp = 0;
					while (cur->p != NULL) {
						curp++;
						REP(i, robots.size()) {
							if (robots[i] == cur->v) {
								curp--;
								break;
							}
						}
						cur = cur->p;
					}
					chmin(penalty, curp);
				}
			}
			_ASSERTE(penalty != INT_MAX);
			//c1++;sum1 += dist[frp][top] + penalty;
			return dist[frp][top] + penalty;
		}
		else if (level == 5) {
			int penalty = INT_MAX;
			for (auto itr : block[frp][top]) {
				pii walls[10]; int pc = 0;
				if (itr->root == frp) {
					Node<pii>* cur = itr;
					int curp = 0;
					while (cur->p != NULL) {
						int Mindist = INT_MAX;
						REP(i, robots.size()) {
							chmin(Mindist, dist[PNUM(robots[i])][PNUM(cur->v)]);
						}
						REP(i, pc) {
							chmin(Mindist, dist[PNUM(walls[i])][PNUM(cur->v)]);
						}
						walls[pc] = cur->v;
						pc++;
						curp += Mindist;
						cur = cur->p;
					}
					chmin(penalty, curp);
				}
			}
			_ASSERTE(penalty != INT_MAX);
			//c2++; sum2 += dist[frp][top] + penalty;
			return dist[frp][top] + penalty;
		}
	}
	int DFS(vector<pii>& robots, int idx, pii to, vector<pair<int, pii>>& history,
		int* bound, int mxlv = 0, int br = 0, int depth = 0, bool res = false) {


		static unordered_map<ll, pair<vector<pair<int, pii>>, vector<pii>>> al;
		static unordered_map<ll, int> cant, can;

		if (res == true) {
			al.clear();
			cant.clear();
		}

		ll hash = Encode(robots, idx);

		if (cant.count(hash)) {
			if (cant[hash] >= *bound - depth - 1)
				return -1;
		}
		statecou++;
		if (depth >= *bound) return -1;
		if (mxlv >= -1) {
			if (depth + Estimate(robots, idx, to, -1) >= *bound) {
				return -1;
			}
		}
		if (mxlv >= 0) {
			if (depth + Estimate(robots, idx, to, 0) >= *bound) {
				return -1;
			}
		}
		if (mxlv >= 1) {
			if (depth + Estimate(robots, idx, to, 1) >= *bound) {
				chmax(cant[hash], *bound - depth - 1);
				return -1;
			}
		}
		if (mxlv >= 2) {
			if (depth + (Estimate(robots, idx, to, 3)) >= *bound) {
				chmax(cant[hash], *bound - depth - 1);
				return -1;
			}
		}
		if (al.count(hash)) {
			if (depth + al[hash].first.size() >= *bound) return -1;
			//cout << depth + al[hash].size() << endl;
			chmin(*bound, depth + (int)al[hash].first.size());
			auto buf = al[hash];
			map<int, int> tai;
			REP(i, robots.size()) {
				REP(j, robots.size()) {
					if (buf.second[j] == robots[i])
						tai[j] = i;
				}
			}
			for (auto& itr : buf.first)
				itr.first = tai[itr.first];
			history = buf.first;
			return al[hash].first.size();
		}
		if (robots[idx] == to) {
			if (depth >= *bound) return -1;
			//cout << depth << endl;
			chmin(*bound, depth);
			al[hash] = pair<vector<pair<int, pii>>, vector<pii>>(vector<pair<int, pii>>(), robots);
			return 0;
		}



		//cant[hash] = -1;//子で到達するのを防ぐ

		pair<int, vector<pair<int, pii>>> Min;
		Min.first = INT_MAX;
		//chmin(*bound, depth +Greedy(robots, idx, to) + 1);



		int index[5] = { 0,1,2,3,4 };
		//rotate(index, index + br, index + br + 1);
		int index2[4] = { 0,1,2,3 };
		REP(i, robots.size()) {
			pii cp = robots[index[i]];
			REP(j, 4) {
				pii nex = Go(robots, index[i], index2[j]);
				if (nex == cp) continue;
				robots[index[i]] = nex;

				vector<pair<int, pii>> buf;
				int ret = DFS(robots, idx, to, buf, bound, mxlv, index[i], depth + 1);
				if (ret != -1) {
					buf.push_back({ index[i], nex });
					Min = min(Min, { ret + 1, buf });
				}
				robots[index[i]] = cp;
			}
		}

		//cant.erase(hash);

		if (Min.first != INT_MAX) {
			al[hash].first = history = Min.second;
			al[hash].second = robots;
			return Min.first;
		}
		else
		{
			chmax(cant[hash], *bound - depth - 1);
			return -1;
		}
	}

	vector<pair<int, pii>> DFSSolve(vector<pii> robots, int idx, pii to, int bound, int mxlv, bool res = true) {
		swap(robots[idx], robots[0]);
		if (block[0][0].size() == 0)
			Calcdist();

		vector<pair<int, pii>> ret;
		DFS(robots, 0, to, ret, &bound, mxlv, 0, 0, res);
		reverse(ALL(ret));
		for (auto& itr : ret) {
			if (itr.first == idx) itr.first = 0;
			else if (itr.first == 0) itr.first = idx;
		}
		return ret;
	}

	vector<pair<int, pii>> BFSSolve(vector<pii> robots, int idx, pii to) {

		struct State {
			vector<pii> robots;
			vector<pair<int, pii>> history;
		};

		pii fr = robots[idx];

		//unordered_map<int, int> memo;
		unordered_set<ll> al;

		queue<State> st;
		State init;
		init.robots = robots;
		st.push(init);

		while (st.size()) {
			statecou++;
			State cur = st.front();
			st.pop();
			ll hash = Encode(cur.robots, idx);

			if (cur.robots[idx] == to) {
				return cur.history;
			}

			if (al.count(hash)) {
				continue;
			}
			al.insert(hash);

			REP(i, robots.size()) {
				//if (i != idx) continue;
				pii cp = cur.robots[i];
				REP(j, 4) {
					pii nex = Go(cur.robots, i, j);
					cur.history.push_back({ i, nex });
					cur.robots[i] = nex;

					if (!al.count(Encode(cur.robots, idx)))
						st.push(cur);

					cur.history.pop_back();
					cur.robots[i] = cp;
				}
			}

		}
	}
};

vector<int> DistinctRNG(int f, int t, int num) { // [f,t) numko
	int range = t - f;
	vector<int> ret(num);
	REP(i, num) {
		ret[i] = rand() % (range - i);
		int ad = 0;
		REP(j, i) {
			if (ret[j] <= ret[i])
				ad++;
		}
		ret[i] += ad;
	}


	REP(i, num) ret[i] += f;
	return ret;
}


signed main(void) {

	Board board;

	board.Scan();

	auto start = clock();

	vector<pii> robots(5);

	REP(i, 5) {
		cin >> robots[i].first >> robots[i].second;
	}
	
	int idx;
	pii goal;
	cin >> idx;
	cin >> goal.first >> goal.second;

	int fbound = 12;
	while (1) {
		auto sol = board.DFSSolve(robots, idx, goal, fbound, 0, true);
		fbound++;
		if (sol.size() == 0)continue;
		cout << sol.size() << endl;
		for (auto itr : sol) {
			printf("%d %d %d\n", itr.first, itr.second.first, itr.second.second);
		}
		break;
	}
	return 0;
}