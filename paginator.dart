import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

part 'search_state.dart';

part 'search_state_notifier.freezed.dart';

final _searchStateProvider = AutoDisposeStateNotifierProvider<SearchStateNotifier, SearchState>((ref) => SearchStateNotifier(ref.read),);

class SearchStateNotifier extends StateNotifier<SearchState> {
  SearchStateNotifier(this._reader) : super(const SearchState.started());

  static AutoDisposeStateNotifierProvider<SearchStateNotifier, SearchState> get provider => _searchStateProvider;

  final Reader _reader;
  final List<Business> _businesses = [];
  List<Business> _searchBusinesses = [];
  String searchValue = '';

  Future<void> searchPaginate({
    bool firstTimeLoading = false,
    bool trending = false,
    bool newlyAdded = false,
    bool recommended = false,
    bool perks = false,
    bool events = false,
    String categoryId = '',
    String search = '',
    String stateCode = '',
    List<String> subcategoryIdList = const [],
    List<String> tagIdList = const [],
    String iso2 = '',
    String sort = 'recently',
    int page = 1,
    bool locationNearMe = false,
  }) async {
    if (firstTimeLoading && searchValue != search) state = const SearchState.loadInProgress();
    // if (sort.isNotEmpty) state = const SearchState.loadInProgress();
    try {
      var body = await _reader(Repository.common).getSpots(categoryId: categoryId, trending: trending, newlyAdded: newlyAdded, recommended: recommended, perks: perks, events: events, search: search, stateCode: stateCode, iso2: iso2, sort: sort, page: page, subcategoryIdList: subcategoryIdList, tagIdList: tagIdList, pageSize: 20, locationNearMe: locationNearMe,);
      List businessList = body['spots'] as List;
      int pageSize = body['totalCount'];
      List<Business> businesses = businessList.map((e) => Business.fromJson(e)).toList();

      if (search.isNotEmpty) {
        updateSearchList(search, businesses, pageSize);
      } else {
        await updateList(businesses, pageSize);
      }

    } on RepositoryException catch (e) {
      if (isConnectionError(e)) {
        state = const SearchState.error(isConnectionError: true);
      } else if (e.message != null) {
        state = SearchState.error(
          error: AppError(statusCode: e.statusCode, message: e.message, error: e.error,),
        );
      } else {
        state = const SearchState.error();
      }
    }
  }

  Future<void> updateList(List<Business> newBusinesses, int page) async {
    if (_businesses.isNotEmpty) {
      state = SearchState.paginate(businesses: _businesses..addAll(newBusinesses), page: page);
    } else {
      _businesses.addAll(newBusinesses);
      state = SearchState.paginate(businesses: _businesses, page: page);
    }
  }

  Future<void> updateSearchList(String search, List<Business> newBusinesses, int page) async {
    if (_searchBusinesses.isNotEmpty && searchValue == search) {
      state = SearchState.paginate(businesses: _searchBusinesses..addAll(newBusinesses), page: page);
    } else {
      searchValue = search;
      _searchBusinesses = [];
      _searchBusinesses.addAll(newBusinesses);
      state = SearchState.paginate(businesses: _searchBusinesses, page: page);
    }
  }
}
