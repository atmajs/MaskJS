import { log_warn } from '@core/util/reporters';
import { Compo } from './Compo';


/**
 *	Get component that owns an element
 **/

export const Anchor =  {
		create: function(compo){
			var id = compo.ID;
			if (id == null){
				log_warn('Component should have an ID');
				return;
			}
			_cache[id] = compo;
		},
		resolveCompo: function(el, silent?){
			if (el == null)
				return null;
			
			var ownerId, id, compo;
			do {
				id = el.getAttribute('x-compo-id');
				if (id != null) {
					if (ownerId == null) {
						ownerId = id;
					}
					compo = _cache[id];
					if (compo != null) {
						compo = Compo.find(compo, {
							key: 'ID',
							selector: ownerId,
							nextKey: 'components'
						});
						if (compo != null) 
							return compo;
					}
				}
				el = el.parentNode;
			}while(el != null && el.nodeType === 1);

			// if DEBUG
			ownerId && silent !== true && log_warn('No controller for ID', ownerId);
			// endif
			return null;
		},
		removeCompo: function(compo){
			var id = compo.ID;
			if (id != null) 
				_cache[id] = void 0;
		},
		getByID: function(id){
			return _cache[id];
		}
	};

	var _cache = {};
