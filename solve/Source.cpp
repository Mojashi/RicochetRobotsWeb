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
#define bitcheck(a,b)   ((a >> (b)) & 1)
#define bitset(a,b)      ( a |= (1 << (b)))
#define bitunset(a,b)    (a &= ~(1 << (b)))
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
void Fill(A(&array)[N], const T & val) {
	std::fill((T*)array, (T*)(array + N), val);
}
pii Dir[4] = {
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
	bool wall[4] = {}, is_mirror = false, marked = false;
	int color = NOCOLOR, mark = NOMARK, nextdir[4] = { UP, RIGHT, DOWN, LEFT}, mirror_color = NOCOLOR;
};
int count32bit(unsigned v) {
	unsigned count = (v & 0x55555555) + ((v >> 1) & 0x55555555);
	count = (count & 0x33333333) + ((count >> 2) & 0x33333333);
	count = (count & 0x0f0f0f0f) + ((count >> 4) & 0x0f0f0f0f);
	count = (count & 0x00ff00ff) + ((count >> 8) & 0x00ff00ff);
	return (count & 0x0000ffff) + ((count >> 16) & 0x0000ffff);
}

int statecou = 0;
static const int Width = 16, Height = 16, Robotnum = 5, Mainrobot = 0;
typedef array<pii, Robotnum> RobotPos;

struct Board {

	Tile field[Height][Width];
	unsigned int vwalls[Width] = {}, hwalls[Height] = {};
	unsigned int mask[2][17] = {}, MSB[1 << 17], LSB[1 << 17];
	bool nxw[Height][Width] = {};
#define PNUM(a) (a.first * Width + a.second)
#define PtoD(x) ((x.first + 3*x.first + x.second + 4*x.second)%4)
#define ValidPos(p) (p.first >= 0 && p.first < Height && p.second >= 0 && p.second < Width)

	unordered_map<ll, int> rever;//from goal to start
	int reverdepth = -1;
	const pii INVALID_MOVE = { -100,-100 };
	const array<int, 4> mirror_type[2] = { array<int, 4>{LEFT,DOWN,RIGHT,UP}, array<int, 4>{RIGHT, UP, LEFT, DOWN}};
	const int DUMMYNUM = PNUM(MP(7, 7));

	inline int MSB32bit(unsigned v) {
		if (v == 0) return -1;
		v |= (v >> 1);
		v |= (v >> 2);
		v |= (v >> 4);
		v |= (v >> 8);
		v |= (v >> 16);
		return count32bit(v) - 1;
	}

	inline int LSB32bit(unsigned v) {
		if (v == 0) return Width + 1;
		v |= (v << 1);
		v |= (v << 2);
		v |= (v << 4);
		v |= (v << 8);
		v |= (v << 16);
		return 32 - count32bit(v);
	}

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
			if (f.first + Dir[dir].first >= 0 && f.second + Dir[dir].second >= 0 && f.first + Dir[dir].first < 16 && f.second + Dir[dir].second < 16)
				field[f.first + Dir[dir].first][f.second + Dir[dir].second].wall[(dir + 2) % 4] = true;
		}

		//mirror
		while (1) {
			pii f;
			int type, color;
			scanf("%d %d %d %d", &f.first, &f.second, &color, &type);
			if (f.first == -1) break;

			field[f.first][f.second].is_mirror = true;
			field[f.first][f.second].mirror_color = color;
			
			REP(i, 4) {
				field[f.first][f.second].nextdir[i] = mirror_type[type][i];
			}

		}

		REP(i, Width) {
			bool curw = field[0][i].wall[UP] | field[Width - 1][i].wall[DOWN];
			field[0][i].wall[UP] = curw;
			field[Width - 1][i].wall[DOWN] = curw;
		}
		REP(i, Height) {
			bool curw = field[i][0].wall[LEFT] | field[i][Height - 1].wall[RIGHT];
			field[i][0].wall[LEFT] = curw;
			field[i][Height - 1].wall[RIGHT] = curw;
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
				if (field[i][j].wall[UP] || field[i][j].is_mirror)
					bitset(vwalls[j], i), bitset(vwalls[j], i == 0 ? Height : i);

				if (field[i][j].wall[DOWN] || field[i][j].is_mirror)
					bitset(vwalls[j], i + 1), bitset(vwalls[j], i == Height - 1 ? 0 : i + 1);

				if (field[i][j].wall[LEFT] || field[i][j].is_mirror)
					bitset(hwalls[i], j), bitset(hwalls[i], j == 0 ? Width : j);

				if (field[i][j].wall[RIGHT] || field[i][j].is_mirror)
					bitset(hwalls[i], j + 1), bitset(hwalls[i], j == Width - 1 ? 0 : j + 1);
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

	inline ll Encode(RobotPos robots, int idx) {
		ll ret = 0;
		REP(i, robots.size()) {
			ll cur = PNUM(robots[i]);
			ret |= cur << i * 8;
		}
		return ret;
	}

	pii Go(RobotPos robots, int idx, int dir) {
		pii ret = robots[idx];

		unsigned int rvwalls[Width] = {}, rhwalls[Height] = {};

		REP(i, robots.size()) {
			if (i == idx) continue;

			rvwalls[robots[i].second] |= (1 << (robots[i].first));
			rvwalls[robots[i].second] |= (1 << (robots[i].first + 1));
			rhwalls[robots[i].first] |= (1 << (robots[i].second));
			rhwalls[robots[i].first] |= (1 << (robots[i].second + 1));
			if (robots[i].first == Height - 1)
				rvwalls[robots[i].second] |= (1 << 0);
			if (robots[i].first == 0)
				rvwalls[robots[i].second] |= (1 << Height);
			if (robots[i].second == Width - 1)
				rhwalls[robots[i].first] |= (1 << 0);
			if (robots[i].second == 0)
				rhwalls[robots[i].first] |= (1 << Width);
		}
		robots[idx] = { -1,-1 };

		bool ita[Height][Width][4] = {};

		while (1) {
			if (ita[ret.first][ret.second][dir]) {
				return INVALID_MOVE;
			}
			ita[ret.first][ret.second][dir] = 1;

			switch (dir) {
			case UP:
				ret.first = MSB[(vwalls[ret.second] | rvwalls[ret.second]) & mask[1][ret.first + 1]];
				break;
			case RIGHT:
				ret.second = LSB[(hwalls[ret.first] | rhwalls[ret.first]) & mask[0][ret.second + 1]] - 1;
				break;
			case LEFT:
				ret.second = MSB[(hwalls[ret.first] | rhwalls[ret.first]) & mask[1][ret.second + 1]];
				break;
			case DOWN:
				ret.first = LSB[(vwalls[ret.second] | rvwalls[ret.second]) & mask[0][ret.first + 1]] - 1;
				break;
			}

			ret.first = (ret.first + Height) % Height;
			ret.second = (ret.second + Width) % Width;
			
			if (field[ret.first][ret.second].wall[dir] || robots.end() != find(ALL(robots), MP((ret.first + Dir[dir].first + Height) % Height, (ret.second + Dir[dir].second + Width) % Width))) {
				break;
			}

			ret.first = (ret.first + Dir[dir].first + Height) % Height;
			ret.second = (ret.second + Dir[dir].second + Width) % Width;

			if (field[ret.first][ret.second].is_mirror && field[ret.first][ret.second].mirror_color != idx)
				dir = field[ret.first][ret.second].nextdir[dir];

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
		Node(Node * par, T in) : p(par), v(in) { if (par != NULL) root = par->root; }
	};

	int dist[Robotnum][256][256] = {}, distdir[Robotnum][256][256][4] = {};


	void Calcdist() {
		REP(cc, Robotnum) {

			Fill(dist[cc], INT_MAX / 10);
			Fill(distdir[cc], INT_MAX / 10);

			REP(st, 256) {
				queue<pair<pii, int>> que;
				que.push({ { 1,st}, 0 });
				que.push({ { 1,st}, 1 });
				que.push({ { 1,st}, 2 });
				que.push({ { 1,st}, 3 });

				while (que.size()) {
					auto cur = que.front();
					que.pop();
					if (distdir[cc][st][cur.first.second][cur.second] <= cur.first.first)	continue;

					distdir[cc][st][cur.first.second][cur.second] = cur.first.first;

					pii pos = { cur.first.second / Width, cur.first.second % Width };
					int dir = cur.second;

					if(field[pos.first][pos.second].is_mirror && field[pos.first][pos.second].mirror_color != cc)
						dir = field[pos.first][pos.second].nextdir[cur.second];

					REP(i, 4) {
						if (field[pos.first][pos.second].wall[i]) continue;
						int nex = PNUM(MP((pos.first + Dir[i].first + Height) % Height, (pos.second + Dir[i].second + Width) % Width));

						if (distdir[cc][st][nex][i] > cur.first.first + (i != dir))
							que.push({ { cur.first.first + (i != dir), nex }, i });
					}
				}

				distdir[cc][st][st][0] = 0;
				distdir[cc][st][st][1] = 0;
				distdir[cc][st][st][2] = 0;
				distdir[cc][st][st][3] = 0;

			}

			REP(st, 256) {
				REP(en, 256) {
					dist[cc][st][en] = min({ distdir[cc][st][en][0],distdir[cc][st][en][1] ,distdir[cc][st][en][2] ,distdir[cc][st][en][3] });
				}
			}
		}

	}



	bool nxr[Height + 2][Width + 2] = {};
	inline int Estimate(RobotPos & robots, int idx, pii to, int level) {
		int frp = PNUM(robots[idx]), top = PNUM(to);
		if (level == -1) {
			return (to.first != robots[idx].first) + (to.second != robots[idx].second);
		}
		if (level == 0) {
			return dist[idx][frp][top];
		}
	}
	int DFS(RobotPos & robots, int idx, pii to, vector<pair<int, pii>> & history,
		int* bound, int mxlv = 0, int br = 0, int bdir = -3, int depth = 0, bool res = false) {


		static unordered_map<ll, pair<vector<pair<int, pii>>, RobotPos>> al;
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

		if (mxlv >= 0) {
			if (depth + Estimate(robots, idx, to, 0) >= *bound) {
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
			al[hash].second = robots;
			return 0;
		}



		//cant[hash] = -1;//Žq‚Å“ž’B‚·‚é‚Ì‚ð–h‚®

		pair<int, vector<pair<int, pii>>> Min;
		Min.first = INT_MAX;
		//chmin(*bound, depth +Greedy(robots, idx, to) + 1);



		int index[5] = { 0,1,2,3,4 };
		swap(index[0], index[br]);
		//rotate(index, index + br, index + br + 1);
		int index2[4] = { 0,1,2,3 };
		REP(i, robots.size()) {
			pii cp = robots[index[i]];
			REP(j, 4) {
				pii nex = Go(robots, index[i], index2[j]);
				if (nex == cp || nex == INVALID_MOVE) continue;
				robots[index[i]] = nex;

				vector<pair<int, pii>> buf;
				int ret = DFS(robots, idx, to, buf, bound, mxlv, index[i], index2[j], depth + 1);
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

	vector<pair<int, pii>> DFSSolve(RobotPos robots, int idx, pii to, int bound, int mxlv, bool res = true) {
		
		vector<pair<int, pii>> ret;
		DFS(robots, idx, to, ret, &bound, mxlv, 0,-3,  0, res);
		reverse(ALL(ret));
		return ret;
	}


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
};


signed main(void) {

	RobotPos a,b;

	Board board;

	board.Scan();
	board.Calcdist();

	auto start = clock();

	RobotPos robots;

	REP(i, 5) {
		cin >> robots[i].first >> robots[i].second;
	}

	int idx;
	pii goal;
	cin >> idx;
	cin >> goal.first >> goal.second;

	//board.EnumurateRever(5, goal.first * board.Width + goal.second);

	int fbound =11;
	while (1) {
		auto sol = board.DFSSolve(robots, idx, goal, fbound, 3, fbound == 11);
		fbound += 5;
		if (sol.size() == 0)continue;
		cout << sol.size() << endl;
		for (auto itr : sol) {
			printf("%d %d %d\n", itr.first, itr.second.first, itr.second.second);
		}
		break;
	}
	return 0;
}